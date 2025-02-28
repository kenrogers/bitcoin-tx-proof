import { bytesToHex, expectOk, hexToBytes, projectFactory, ResponseOk } from '@clarigen/core';
import { BitcoinRPCConfig, bitcoinTxProof } from '..';
import { BitcoinRPC } from '../rpc';
import { project } from './clarigen-types';
import {
  BufferCV,
  bufferCV,
  ClarityType,
  cvToString,
  listCV,
  ResponseOkCV,
  SomeCV,
  tupleCV,
  UIntCV,
  uintCV,
} from '@stacks/transactions';
import { initSimnet } from '@hirosystems/clarinet-sdk';
import { cachedProof } from './cached-proof';
const { clarityBitcoinLibV5 } = projectFactory(project, 'simnet');

describe('Clarity Bitcoin Lib v5 verification', () => {
  // Using real Bitcoin transaction id from mainnet
  const txId = 'c1de234c01ecc47906117d012865ce3dabbbb081dc0309a74dbbae45e427aadc';

  const rawTx =
    '02000000000101f6e86a2b938453e199836ad4e2ba751c5ded24f4e1c2934b3434cd00f9bce61d0100000000fdffffff02856e00000000000017a914c5beca99b2b4c558b297ed9134142f4a3873f4e987d0b8390100000000160014b84ef1e7e398d56fa88a356df3139ff997114f040247304402205edad21077602766ffbce1276b6a3b69577a521b28dc18d8062303723ac91cc802200ec9ea72f62069b1e5817a999fa3d31acf0f655a159691feb8161fb33b93f3fa012103997651fec067eda2c430bfe548f65575737c9b892d8b529ae9dc0dfcb5c5898a00000000';
  const blockHeight = 883230;
  const stacksBlockHeight = 595050; // first stacks block after 882876 but anchored to 882878
  const rpcConfig: BitcoinRPCConfig = {
    url: 'http://192.168.129.114:8332',
    username: 'fivemonkeys',
    password: 'stackstacks',
  };

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

    const fromRemote = false;
    const proof = fromRemote ? await bitcoinTxProof(txId, blockHeight, rpcConfig) : cachedProof;

    const header = simnet.callReadOnlyFn(
      clarityBitcoinLibV5.identifier,
      'verify-block-header',
      [bufferCV(hexToBytes(proof.blockHeader)), uintCV(blockHeight)],
      alice
    );
    expect(header.result.type).toBe(ClarityType.BoolTrue);

    const legacyTxVerified = simnet.callReadOnlyFn(
      clarityBitcoinLibV5.identifier,
      'was-tx-mined-compact',
      [
        uintCV(blockHeight),
        bufferCV(hexToBytes(proof.coinbaseTransaction)),
        bufferCV(hexToBytes(proof.blockHeader)),
        tupleCV({
          hashes: listCV(proof.coinbaseMerkleProofArray.map(bufferCV)),
          'tx-index': uintCV(0),
          'tree-depth': uintCV(proof.coinbaseMerkleProofArray.length),
        }),
      ],
      alice
    );
    console.log(cvToString(legacyTxVerified.result));

    expect(legacyTxVerified.result.type).toBe(ClarityType.ResponseOk);
    expect((legacyTxVerified.result as ResponseOkCV).value.type).toBe(ClarityType.ResponseOk);

    const segwitTxVerify = simnet.callReadOnlyFn(
      clarityBitcoinLibV5.identifier,
      'was-segwit-tx-mined-compact',
      [
        uintCV(stacksBlockHeight),
        bufferCV(hexToBytes(rawTx)),
        bufferCV(hexToBytes(proof.blockHeader)),
        uintCV(proof.txIndex),
        uintCV(proof.merkleProofDepth),
        listCV(proof.witnessMerkleProofArray.map(bufferCV)),
        bufferCV(hexToBytes(proof.witnessMerkleRoot)),
        bufferCV(hexToBytes(proof.witnessReservedValue)),
        bufferCV(hexToBytes(proof.coinbaseTransaction)),
        listCV(proof.coinbaseMerkleProofArray.map(bufferCV)),
      ],
      alice
    );
    expect(segwitTxVerify.result.type).toBe(ClarityType.ResponseOk);
    console.log((segwitTxVerify.result as ResponseOkCV).value);
    expect((segwitTxVerify.result as ResponseOkCV).value.type).toBe(ClarityType.ResponseOk);
  }, 100_000);
});
