import { BitcoinRPCConfig } from './types';

export function validateTxId(txid: string): void {
  if (!/^[a-fA-F0-9]{64}$/.test(txid)) {
    throw new Error('Invalid transaction ID format');
  }
}

export function validateBlockHeight(height: number): void {
  if (!Number.isInteger(height) || height < 0) {
    throw new Error('Block height must be a positive integer');
  }
}

export function validateRPCConfig(config: BitcoinRPCConfig): void {
  if (!config.url) {
    throw new Error('RPC URL is required');
  }
  if (!/^https?:\/\//.test(config.url)) {
    throw new Error('Invalid RPC URL format');
  }
  if ((config.username && !config.password) || (!config.username && config.password)) {
    throw new Error('Both username and password must be provided if using authentication');
  }
}