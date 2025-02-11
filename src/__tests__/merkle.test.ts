import { calculateWTXID, calculateMerkleRoot, getMerkleProof, verifyMerkleProof } from '../merkle';

describe('Merkle Tree Calculations', () => {
  // Using real Bitcoin transaction hex from testnet
  const sampleTx1 = '020000000001010000000000000000000000000000000000000000000000000000000000000000ffffffff0403a08601feffffff0200f2052a010000001976a914d0c59903c5bac2868760e90fd521a4665aa7652088ac0000000000000000266a24aa21a9ede2f61c3f71d1defd3fa999dfa36953755c690689799962b48bebd836974e8cf90120000000000000000000000000000000000000000000000000000000000000000000000000';
  const sampleTx2 = '020000000001010000000000000000000000000000000000000000000000000000000000000000ffffffff0403a08601feffffff0200f2052a010000001976a914d0c59903c5bac2868760e90fd521a4665aa7652088ac0000000000000000266a24aa21a9ede2f61c3f71d1defd3fa999dfa36953755c690689799962b48bebd836974e8cf90120000000000000000000000000000000000000000000000000000000000000000000000000';

  test('calculateWTXID returns correct hash for non-witness tx', () => {
    const result = calculateWTXID(sampleTx1);
    expect(result.toString('hex')).toHaveLength(64);
  });

  test('calculateWTXID returns correct hash for witness tx', () => {
    const result = calculateWTXID(sampleTx2);
    expect(result.toString('hex')).toHaveLength(64);
  });

  test("calculateWTXID returns correct hash for txs of 553724", () => {
    let result = calculateWTXID(
      "010000000001010000000000000000000000000000000000000000000000000000000000000000ffffffff5403fc72081b4d696e656420627920416e74506f6f6c31384e00a103205c130870fabe6d6d0782f935d81e4948c75d613779fe7c53eab4c35616d073755df5fe49f3cdb16d0400000000000000cc050000d38d0200ffffffff039590814a000000001976a914edf10a7fac6b32e24daa5305c723f3de58db1bc888ac0000000000000000266a24aa21a9ed6502e8637ba29cd8a820021915339c7341223d571e5e8d66edd83786d387e71500000000000000002952534b424c4f434b3abcb062d40bf073e3eac877f2b1bad4eddc4f8d882ab014a8d2278563f832e95b0120000000000000000000000000000000000000000000000000000000000000000000000000"
    );
    expect(result.reverse().toString("hex")).toStrictEqual(
      "0000000000000000000000000000000000000000000000000000000000000000"
    );

    result = calculateWTXID(
      "01000000000101d5e952cd14859215e51e8e3117ddd2528cb396a4935cc6c8a77b5e541ab5a6bc000000001716001473e8ab17ce626fc190105f583f0073c76a6b37d9ffffffff028754030000000000160014d3421512c645bcfa2af9743a18731001f0173904a0636f000000000017a914379056a3f6d10caa54ee8ef27131c348a7ccf31f870247304402200fd489534abd79ef87d0c2a3e5db3d3e77b91c2c19d76421f7b61ce6cf3789e202206fa79d2e723462694880b37a93e4155a11b4a533c3a2c82f5d917f9cb30b13410121034d12143057d8154b0a0044548861a29fb93ec1e1da607c9661c46a1dfef6bf6f00000000"
    );
    expect(result.reverse().toString("hex")).toStrictEqual(
      "8700d546b39e1a0faf34c98067356206db50fdef24e2f70b431006c59d548ea2"
    );

    result = calculateWTXID(
      "01000000000101892566a371164774c8b2b74b0e1274ae4ba3a6cbd925c0ac0376f4624284c5340000000000ffffffff028809250000000000160014bed752ca565818fee0c7be61713dec3b9b4841e237aeb7000000000017a9144c13003630a952f25cfc24728b69e5b65dc7fc6787024730440220212ed58e54c2fbf219fb6db8c4ea4854e62d56667ff1a74da91cd27fc62e10c4022018923a537ba525f68e64ce0b70a36b4839b55aecd791dab8d85052c69594f1f50121034e6622f089ad175ab1aca77487577e350fb00413a7420250d60422a2e0cc40a900000000"
    );
    expect(result.reverse().toString("hex")).toStrictEqual(
      "c54bab5960d3a416c40464fa67af1ddeb63a2ce60a0b3c36f11896ef26cbcb87"
    );

    result = calculateWTXID(
      "02000000016fecfb516620f12e95907780828df66e27b7cebc80254ccb2e60dca44b7bcc13000000006b483045022100da31f58b0e2ec9da2e8fadaa38e7b1d0084433fc62160e02c7b7016e6e31477f02206a0462df44e82869798337f5523286972c93d66d523f137c0db5a4baa6e6930d0121034b11147333a38bfb9466c60bec7ce3dc608a4fd2315227fae928a7c10556e9a5feffffff02c0d401000000000017a91401f7b90f5653e8c2a45093c3b2168cfa7e46811e87f7461300000000001976a914b95067af2d4ebef77ddeae544963fa04df66bb0a88acfa720800"
    );
    expect(result.reverse().toString("hex")).toStrictEqual(
      "e51de361009ef955f182922647622f9662d1a77ca87c4eb2fd7996b2fe0d7785"
    );
  });

  test('calculateMerkleRoot works with empty array', () => {
    const result = calculateMerkleRoot([]);
    expect(result.length).toBe(32);
    expect(result.equals(Buffer.alloc(32, 0))).toBe(true);
  });

  test('getMerkleProof generates valid proof', () => {
    const tx1Hash = Buffer.from('a'.repeat(64), 'hex'); // Using dummy hash
    const tx2Hash = Buffer.from('b'.repeat(64), 'hex'); // Using dummy hash
    const proof = getMerkleProof([tx1Hash, tx2Hash], 0);
    expect(proof.length).toBe(1);
    expect(proof[0].data.equals(tx2Hash)).toBe(true);
    expect(proof[0].position).toBe('right');
  });

  test('verifies merkle proof correctly', () => {
    const tx1Hash = Buffer.from('a'.repeat(64), 'hex');
    const tx2Hash = Buffer.from('b'.repeat(64), 'hex');
    const proof = getMerkleProof([tx1Hash, tx2Hash], 0);
    const root = calculateMerkleRoot([tx1Hash, tx2Hash]);

    expect(verifyMerkleProof(tx1Hash, proof, root)).toBe(true);
  });
});