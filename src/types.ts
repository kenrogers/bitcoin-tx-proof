export interface BitcoinRPCConfig {
  url: string;
  username?: string;
  password?: string;
}

export interface TxProofResult {
  blockHeight: number;
  transaction: string;
  blockHeader: string;
  txIndex: number;
  merkleProofDepth: number;
  witnessMerkleRoot: string;
  witnessMerkleProof: string;
  witnessMerkleProofArray: Uint8Array<ArrayBuffer>[];
  witnessReservedValue: string;
  coinbaseTransaction: string;
  coinbaseMerkleProof: string;
  coinbaseMerkleProofArray: Uint8Array<ArrayBuffer>[];
}
