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
  witnessMerkleProof: string;
  witnessReservedValue: string;
  coinbaseTransaction: string;
  coinbaseMerkleProof: string;
}