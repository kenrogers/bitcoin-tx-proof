import { bytesToHex, hexToBytes, projectFactory } from '@clarigen/core';
import { initSimnet } from '@hirosystems/clarinet-sdk';
import {
  BufferCV,
  bufferCV,
  ClarityType,
  listCV,
  ResponseOkCV,
  SomeCV,
  tupleCV,
  UIntCV,
  uintCV,
} from '@stacks/transactions';
import { BitcoinRPCConfig, bitcoinTxProof, proofToBuffers, TxProofResult } from '../..';
import { cachedProof } from './cached-proof';
import { project } from './clarigen-types';
const { clarityBitcoinLibV5 } = projectFactory(project, 'simnet');

describe('Clarity Bitcoin Lib v5 verification', () => {
  // Using real Bitcoin transaction id from mainnet
  const txId = 'c1de234c01ecc47906117d012865ce3dabbbb081dc0309a74dbbae45e427aadc';

  const rawTx =
    '02000000000101f6e86a2b938453e199836ad4e2ba751c5ded24f4e1c2934b3434cd00f9bce61d0100000000fdffffff02856e00000000000017a914c5beca99b2b4c558b297ed9134142f4a3873f4e987d0b8390100000000160014b84ef1e7e398d56fa88a356df3139ff997114f040247304402205edad21077602766ffbce1276b6a3b69577a521b28dc18d8062303723ac91cc802200ec9ea72f62069b1e5817a999fa3d31acf0f655a159691feb8161fb33b93f3fa012103997651fec067eda2c430bfe548f65575737c9b892d8b529ae9dc0dfcb5c5898a00000000';
  const blockHeight = 883230;
  // stacksBlockHeight: 595050;

  const rpcConfig: BitcoinRPCConfig = {
    url: 'http://localhost:8332',
  };

  const useCachedProof = true;

  test('confirm clarity remote data', async () => {
    const simnet = await initSimnet();
    const bitcoinBlockHeaderHash =
      '00000000000000000001c55626b85b4b3ecb33f67645356a2b01f4dfba893679';

    const bbh = simnet.execute('burn-block-height');
    expect(Number((bbh.result as UIntCV).value)).toBe(blockHeight);

    var bbhh = simnet.execute('(get-burn-block-info? header-hash burn-block-height)');
    expect(bytesToHex((bbhh.result as SomeCV<BufferCV>).value.buffer)).toBe(bitcoinBlockHeaderHash);
  });

  test('verify tx using Stacks', async () => {
    const simnet = await initSimnet();
    const account = simnet.getAccounts();
    const alice = account.get('wallet_1')!;

    const proof: TxProofResult = useCachedProof
      ? cachedProof
      : await bitcoinTxProof(txId, blockHeight, rpcConfig).then(p => {
          console.log(p);
          return p;
        });

    const header = simnet.callReadOnlyFn(
      clarityBitcoinLibV5.identifier,
      clarityBitcoinLibV5.verifyBlockHeader.abi.name,
      [bufferCV(hexToBytes(proof.blockHeader)), uintCV(blockHeight)],
      alice
    );
    expect(header.result.type).toBe(ClarityType.BoolTrue);

    const coinbaseProofBuffers = proofToBuffers(proof.coinbaseMerkleProof);
    const coinbaseVerified = simnet.callReadOnlyFn(
      clarityBitcoinLibV5.identifier,
      clarityBitcoinLibV5.wasTxMinedCompact.abi.name,
      [
        uintCV(blockHeight),
        bufferCV(hexToBytes(proof.legacyCoinbaseTxHex)),
        bufferCV(hexToBytes(proof.blockHeader)),
        tupleCV({
          hashes: listCV(coinbaseProofBuffers.map(bufferCV)),
          'tx-index': uintCV(0),
          'tree-depth': uintCV(coinbaseProofBuffers.length),
        }),
      ],
      alice
    );
    // entry 0 in txids of https://bitcoinexplorer.org/block/00000000000000000001c55626b85b4b3ecb33f67645356a2b01f4dfba893679#JSON
    const expectedTxId = '17a992d8e38f314cec47136e3059305091d105053c2a98adb7476bf9c0b21270';
    expectResponseWithId(coinbaseVerified, expectedTxId);

    const segwitTxVerify = simnet.callReadOnlyFn(
      clarityBitcoinLibV5.identifier,
      clarityBitcoinLibV5.wasSegwitTxMinedCompact.abi.name,
      [
        uintCV(blockHeight),
        bufferCV(hexToBytes(rawTx)),
        bufferCV(hexToBytes(proof.blockHeader)),
        uintCV(proof.txIndex),
        uintCV(proof.merkleProofDepth),
        listCV(proofToBuffers(proof.witnessMerkleProof).map(bufferCV)),
        bufferCV(hexToBytes(proof.witnessMerkleRoot)),
        bufferCV(hexToBytes(proof.witnessReservedValue)),
        bufferCV(hexToBytes(proof.legacyCoinbaseTxHex)),
        listCV(coinbaseProofBuffers.map(bufferCV)),
      ],
      alice
    );
    // expected hash in https://bitcoinexplorer.org/tx/c1de234c01ecc47906117d012865ce3dabbbb081dc0309a74dbbae45e427aadc#JSON
    const expectedWtxid = '2c6ac48882f2d1f8a972061557c4fcce054ae233ef897719574aafd88da92076';
    expectResponseWithId(segwitTxVerify, expectedWtxid);
  }, 100_000);
});

function expectResponseWithId(response: any, id: string) {
  expect(response.result.type).toBe(ClarityType.ResponseOk);
  const result = response.result as ResponseOkCV<BufferCV>;
  expect(result.value.type).toBe(ClarityType.Buffer);
  expect(bytesToHex(result.value.buffer)).toEqual(id);
}
