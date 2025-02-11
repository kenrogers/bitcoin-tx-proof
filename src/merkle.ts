import { Transaction } from 'bitcoinjs-lib';
import crypto from 'crypto';

const DEBUG = process.env.DEBUG === 'true';

function debug(...args: any[]) {
  if (DEBUG) {
    console.log('\x1b[34m[MERKLE]\x1b[0m', ...args);
  }
}

export function sha256(buffer: Buffer): Buffer {
  return crypto.createHash('sha256').update(buffer).digest();
}

export function hash256(buffer: Buffer): Buffer {
  return sha256(sha256(buffer));
}

export function calculateWTXID(txHex: string): Buffer {
  const tx = Transaction.fromHex(txHex);
  if (!tx.hasWitnesses()) {
    return Buffer.from(tx.getId(), 'hex').reverse();
  }
  return Buffer.from(tx.getHash(true).toString('hex'), 'hex');
}

export function calculateMerkleRoot(hashes: Buffer[]): Buffer {
  debug('Calculating merkle root for', hashes.length, 'hashes');
  if (hashes.length === 0) return Buffer.alloc(32, 0);
  if (hashes.length === 1) {
    debug('Single hash, returning:', hashes[0].toString('hex'));
    return hashes[0];
  }

  const newHashes: Buffer[] = [];
  for (let i = 0; i < hashes.length; i += 2) {
    const left = hashes[i];
    const right = i + 1 < hashes.length ? hashes[i + 1] : left;
    debug('Concatenating:', left.toString('hex'), '+', right.toString('hex'));
    const combined = Buffer.concat([left, right]);
    const newHash = hash256(combined);
    debug('New hash:', newHash.toString('hex'));
    newHashes.push(newHash);
  }

  return calculateMerkleRoot(newHashes);
}

export interface MerkleProofStep {
  position: 'left' | 'right';
  data: Buffer;
}

export function getMerkleProof(hashes: Buffer[], index: number): MerkleProofStep[] {
  debug('Generating merkle proof for index', index, 'in', hashes.length, 'hashes');
  if (hashes.length === 0 || hashes.length === 1) {
    return [];
  }

  const proof: MerkleProofStep[] = [];
  let currentIndex = index;
  let currentLevel = [...hashes];

  while (currentLevel.length > 1) {
    debug('Current level size:', currentLevel.length, 'Current index:', currentIndex);
    const isRightNode = currentIndex % 2 === 1;
    const pairIndex = isRightNode ? currentIndex - 1 : currentIndex + 1;
    const position = isRightNode ? 'left' : 'right';

    if (pairIndex < currentLevel.length) {
      debug('Adding proof step:', position, currentLevel[pairIndex].toString('hex'));
      proof.push({
        position,
        data: currentLevel[pairIndex]
      });
    } else {
      // If there's no pair (odd number of nodes), duplicate the current node
      debug('Adding duplicate proof step:', position, currentLevel[currentIndex].toString('hex'));
      proof.push({
        position,
        data: currentLevel[currentIndex]
      });
    }

    // Calculate next level
    const newLevel: Buffer[] = [];
    for (let i = 0; i < currentLevel.length; i += 2) {
      const left = currentLevel[i];
      const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : left;
      const combined = Buffer.concat([left, right]);
      newLevel.push(hash256(combined));
    }

    currentLevel = newLevel;
    currentIndex = Math.floor(currentIndex / 2);
  }

  debug('Generated proof steps:', proof.map(step => ({
    position: step.position,
    hash: step.data.toString('hex')
  })));
  return proof;
}

export function verifyMerkleProof(txHash: Buffer, proof: MerkleProofStep[], root: Buffer): boolean {
  debug('Verifying merkle proof');
  debug('Starting hash:', txHash.toString('hex'));
  debug('Expected root:', root.toString('hex'));

  let currentHash = txHash;

  for (const step of proof) {
    debug('Proof step:', step.position, step.data.toString('hex'));
    const combined = step.position === 'left' ?
      Buffer.concat([step.data, currentHash]) :
      Buffer.concat([currentHash, step.data]);

    debug('Combined:', combined.toString('hex'));
    currentHash = hash256(combined);
    debug('After hash:', currentHash.toString('hex'));
  }

  debug('Final hash:', currentHash.toString('hex'));
  debug('Expected root:', root.toString('hex'));
  return currentHash.equals(root);
}

export function calculateWitnessMerkleProof(txs: string[], index: number): {
  proof: MerkleProofStep[],
  root: Buffer
} {
  const wtxids = txs.map(tx => calculateWTXID(tx));
  const proof = getMerkleProof(wtxids, index);
  const root = calculateMerkleRoot(wtxids);

  return { proof, root };
}