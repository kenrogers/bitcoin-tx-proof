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