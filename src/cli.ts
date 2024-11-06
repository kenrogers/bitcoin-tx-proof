#!/usr/bin/env node

import { bitcoinTxProof } from './index';
import { validateTxId } from './validation';
import { BitcoinRPC } from './rpc';

// Move DEBUG to global scope and set it directly
let DEBUG = false;

function debug(...args: any[]) {
    if (DEBUG) {
        console.log('\x1b[36m[DEBUG]\x1b[0m', ...args);  // Added color for better visibility
    }
}

async function getBlockHeight(txid: string, rpc: BitcoinRPC): Promise<number> {
    debug('Getting raw transaction:', txid);
    const tx = await rpc.call('getrawtransaction', [txid, true]);
    debug('Raw transaction response:', JSON.stringify(tx, null, 2));

    if (!tx.blockhash) {
        throw new Error('Transaction not yet confirmed in a block');
    }

    debug('Getting block info for hash:', tx.blockhash);
    const block = await rpc.call('getblock', [tx.blockhash]);
    debug('Block info:', JSON.stringify(block, null, 2));

    return block.height;
}

async function main() {
    const args = process.argv.slice(2);

    if (args.length < 1 || args.includes('--help')) {
        console.log(`
Bitcoin Transaction Proof CLI

Usage:
  btxproof <txid> [options]

Options:
  --url <url>         Bitcoin RPC URL (default: http://localhost:8332)
  --user <username>   RPC username
  --pass <password>   RPC password
  --debug            Enable debug output
  --help             Show this help message

Example:
  btxproof 4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b --url http://localhost:8332 --user myuser --pass mypass --debug
    `);
        process.exit(0);
    }

    const [txid] = args;
    const url = args.includes('--url') ? args[args.indexOf('--url') + 1] : 'http://localhost:8332';
    const username = args.includes('--user') ? args[args.indexOf('--user') + 1] : undefined;
    const password = args.includes('--pass') ? args[args.indexOf('--pass') + 1] : undefined;

    // Set DEBUG directly
    DEBUG = args.includes('--debug');
    // Also set it for the index.ts module
    process.env.DEBUG = DEBUG.toString();

    try {
        debug('CLI Arguments:', { txid, url, username: username ? '***' : undefined });
        debug('Debug mode enabled');

        debug('Validating transaction ID:', txid);
        validateTxId(txid);

        const rpcConfig = { url, username, password };
        debug('RPC Config:', { url, username: username ? '***' : undefined });

        const rpc = new BitcoinRPC(rpcConfig);

        console.log('Finding block height...');
        const blockHeight = await getBlockHeight(txid, rpc);
        console.log(`Transaction found in block ${blockHeight}`);

        debug('Generating proof for block height:', blockHeight);
        console.log('Generating proof...');
        const proof = await bitcoinTxProof(txid, blockHeight, rpcConfig);

        debug('Raw proof result:', JSON.stringify(proof, null, 2));

        console.log('\nProof generated successfully!\n');

        // Check if properties exist before accessing them
        if (proof) {
            console.log('Block Height:', proof.blockHeight);
            console.log('Transaction Index:', proof.txIndex);
            console.log('Merkle Proof Depth:', proof.merkleProofDepth);

            if (proof.transaction) {
                console.log('\nTransaction:', proof.transaction.substring(0, 64) + '...');
            } else {
                console.log('\nTransaction: <not available>');
            }

            if (proof.blockHeader) {
                console.log('Block Header:', proof.blockHeader);
            } else {
                console.log('Block Header: <not available>');
            }

            if (proof.witnessMerkleProof) {
                console.log('Witness Merkle Proof:', proof.witnessMerkleProof.substring(0, 64) + '...');
            } else {
                console.log('Witness Merkle Proof: <not available>');
            }

            if (proof.coinbaseTransaction) {
                console.log('Coinbase Transaction:', proof.coinbaseTransaction.substring(0, 64) + '...');
            } else {
                console.log('Coinbase Transaction: <not available>');
            }
        } else {
            console.log('No proof data returned');
        }

    } catch (error: unknown) {
        debug('Error occurred:', error);
        if (error instanceof Error) {
            console.error('Error:', error.message);
            debug('Error stack:', error.stack);
        } else {
            console.error('An unknown error occurred');
            debug('Unknown error:', error);
        }
        process.exit(1);
    }
}

main();