import { BitcoinRPC } from './rpc';
import { TxProofResult, BitcoinRPCConfig } from './types';
import { calculateWTXID, calculateMerkleRoot, getMerkleProof, hash256, MerkleProofStep, calculateWitnessMerkleProof } from './merkle';

const DEBUG = process.env.DEBUG === 'true';

function debug(...args: any[]) {
  if (DEBUG) {
    console.log('\x1b[33m[PROOF]\x1b[0m', ...args);
  }
}

function extractBlockHeader(blockHex: string): string {
  return blockHex.substring(0, 160);
}

function getTxHashes(block: any): Buffer[] {
  debug('Getting tx hashes from:', block.tx);
  const hashes = block.tx.map((tx: any) => {
    const hash = Buffer.from(tx.txid, 'hex').reverse();
    debug('Converted hash:', tx.txid, 'to:', hash.toString('hex'));
    return hash;
  });
  return hashes;
}

function verifyMerkleProof(txid: string, proofSteps: MerkleProofStep[], merkleRoot: string): boolean {
  debug('\n=== Starting Merkle Proof Verification ===');
  debug('Transaction ID:', txid);
  debug('Expected Merkle Root:', merkleRoot);
  debug('Proof steps:', proofSteps.map(step => ({
    position: step.position,
    hash: step.data.toString('hex')
  })));

  // Convert txid to internal byte order (reverse)
  let currentHash = Buffer.from(txid, 'hex').reverse();
  debug('Starting hash (internal order):', currentHash.toString('hex'));

  for (const step of proofSteps) {
    debug('\nProof Step:');
    debug('Current hash:', currentHash.toString('hex'));
    debug('Proof element:', step.data.toString('hex'));
    debug('Position:', step.position);

    const combined = step.position === 'left' ?
      Buffer.concat([step.data, currentHash]) :
      Buffer.concat([currentHash, step.data]);

    debug('Concatenated:', combined.toString('hex'));
    currentHash = hash256(combined);
    debug('After hash256:', currentHash.toString('hex'));
  }

  // Convert final hash back to display order (reverse)
  const calculatedRoot = currentHash.reverse().toString('hex');
  debug('\n=== Final Results ===');
  debug('Calculated root:', calculatedRoot);
  debug('Expected root:', merkleRoot);

  if (calculatedRoot !== merkleRoot) {
    throw new Error(`Merkle proof verification failed: Expected ${merkleRoot} but got ${calculatedRoot}`);
  }

  return true;
}

export async function bitcoinTxProof(
  txid: string,
  blockHeight: number,
  rpcConfig: BitcoinRPCConfig
): Promise<TxProofResult> {
  const rpc = new BitcoinRPC(rpcConfig);

  debug('Getting block hash for height:', blockHeight);
  const blockHash = await rpc.call('getblockhash', [blockHeight]);

  debug('Getting block data...');
  const block = await rpc.call('getblock', [blockHash, 2]);
  debug('Block merkle root:', block.merkleroot);
  debug('Block transactions:', JSON.stringify(block.tx, null, 2));

  const rawBlock = await rpc.call('getblock', [blockHash, 0]);
  const blockHeader = extractBlockHeader(rawBlock);

  // Get transaction hashes and create merkle proof
  const txHashes = getTxHashes(block);
  debug('Transaction hashes (internal order):', txHashes.map(h => h.toString('hex')));

  const txIndex = block.tx.findIndex((tx: any) => tx.txid === txid);
  debug('Transaction index:', txIndex);

  if (txIndex === -1) {
    throw new Error('Transaction not found in block');
  }

  let merkleProof: MerkleProofStep[] = [];
  let merkleProofHex = '';
  if (block.tx.length === 1) {
    debug('Single transaction block - no merkle proof needed');
  } else {
    debug('Calculating merkle proof...');
    merkleProof = getMerkleProof(txHashes, txIndex);
    debug('Merkle proof:', merkleProof.map(step => ({
      position: step.position,
      hash: step.data.toString('hex')
    })));

    if (!verifyMerkleProof(txid, merkleProof, block.merkleroot)) {
      throw new Error('Merkle proof verification failed');
    }
    debug('Merkle proof verified successfully');

    // Convert proof steps to hex string
    merkleProofHex = merkleProof
      .map(step => step.data.toString('hex'))
      .join('');
    debug('Merkle proof hex:', merkleProofHex);
  }

  const rawTx = await rpc.call('getrawtransaction', [txid, true, blockHash]);
  const coinbaseTx = block.tx[0];

  // For single-tx blocks, witness merkle proof is empty
  let witnessMerkleProof = '';
  let witnessMerkleProofArray: Uint8Array<ArrayBuffer>[] = [];
  let root = "";
  if (block.tx.length > 1 && txIndex !== 0) {
    debug('Calculating witness merkle data...');
    try {
      debug('Fetching raw transactions for witness merkle tree...');
      const txs = await Promise.all(block.tx.map(async (tx: any) => {
        const rawTxData = await rpc.call('getrawtransaction', [tx.txid, true, blockHash]);
        const hasWitness = rawTxData.hex.includes('0001') || rawTxData.vin.some((input: any) => input.txinwitness);
        debug(`Transaction ${tx.txid}:`, {
          hasWitness,
          vinLength: rawTxData.vin.length,
          hasWitnessData: rawTxData.vin.some((input: any) => input.txinwitness)
        });
        return rawTxData.hex;
      }));

      debug('Calculating witness merkle proof...');
      const { proof, root: calculatedRoot } = calculateWitnessMerkleProof(txs, txIndex);
      root = calculatedRoot.toString('hex');
      debug('Witness merkle root:', root);
      debug('Witness proof steps:', proof.map(step => ({
        position: step.position,
        hash: step.data.toString('hex')
      })));

      if (proof.length === 0) {
        debug('No witness proof needed (single tx or no witness data)');
        witnessMerkleProof = '';
      } else {
        // Convert proof to hex string
        witnessMerkleProof = proof
          .map(step => step.data.toString('hex'))
          .join('');
        witnessMerkleProofArray = proof.map(step => new Uint8Array(step.data));
        debug('Witness merkle proof hex:', witnessMerkleProof);
      }
    } catch (error) {
      debug('Error in witness calculations:', error);
      if (error instanceof Error) {
        debug('Error stack:', error.stack);
      }
    }
  } else {
    debug('Skipping witness merkle proof:',
      block.tx.length === 1 ? 'single-tx block' :
      txIndex === 0 ? 'coinbase transaction' :
      'unknown reason');
  }

  const result: TxProofResult = {
    blockHeight,
    transaction: rawTx.hex,
    blockHeader,
    txIndex,
    merkleProofDepth: Math.ceil(Math.log2(Math.max(block.tx.length, 2))),
    witnessMerkleRoot: root,
    witnessMerkleProof,
    witnessMerkleProofArray,
    witnessReservedValue: '0000000000000000000000000000000000000000000000000000000000000000',
    coinbaseTransaction: coinbaseTx.hex,
    coinbaseMerkleProof: merkleProofHex,
    coinbaseMerkleProofArray: merkleProof.map(step => new Uint8Array(step.data))
  };

  debug('Final result:', {
    ...result,
    transaction: result.transaction.substring(0, 64) + '...',
    coinbaseTransaction: result.coinbaseTransaction.substring(0, 64) + '...'
  });

  return result;
}

export { BitcoinRPCConfig, TxProofResult };