# Bitcoin Transaction Proof

A TypeScript library for generating Bitcoin transaction proofs, including witness data and merkle proofs. This package helps developers verify Bitcoin transactions and their inclusion in blocks, supporting both SegWit and non-SegWit transactions.

## Features

- Generate transaction proofs with witness data
- Calculate merkle proofs for transaction verification
- Support for both SegWit and non-SegWit transactions
- Built-in caching and rate limiting for RPC calls
- Works with any Bitcoin node (local or remote)
- Full TypeScript support

## Installation

`npm install bitcoin-tx-proof`

## Quick Start

```javascript
import { bitcoinTxProof } from "bitcoin-tx-proof";

// Get proof for a transaction
const proof = await bitcoinTxProof(
  "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b", // txid
  277316, // block height
  {
    url: "http://localhost:8332",
    username: "your_rpc_username", // optional
    password: "your_rpc_password", // optional
  }
);
```

## API Reference

### Main Function

#### bitcoinTxProof(txid, blockHeight, rpcConfig)

Generates a complete transaction proof including witness data.

Parameters:

- txid: string - The transaction ID to generate proof for
- blockHeight: number - The block height containing the transaction
- rpcConfig: BitcoinRPCConfig - Configuration for Bitcoin RPC connection

Returns: Promise<TxProofResult>

Types:

    interface BitcoinRPCConfig {
      url: string;          // Bitcoin RPC endpoint URL
      username?: string;    // Optional RPC username
      password?: string;    // Optional RPC password
    }

    interface TxProofResult {
      blockHeight: number;          // Height of the block
      transaction: string;          // Raw transaction hex
      blockHeader: string;          // Block header hex
      txIndex: number;             // Index in block
      merkleProofDepth: number;    // Merkle tree depth
      witnessMerkleProof: string;  // Witness merkle proof
      witnessReservedValue: string;// Witness reserved value
      coinbaseTransaction: string; // Coinbase transaction
      coinbaseMerkleProof: string;// Coinbase merkle proof
    }

## Advanced Usage

### Direct RPC Access

    import { BitcoinRPC } from 'bitcoin-tx-proof';

    const rpc = new BitcoinRPC({
      url: 'http://localhost:8332',
      username: 'rpcuser',
      password: 'rpcpassword'
    });

    // Make any Bitcoin RPC call
    const blockHash = await rpc.call('getblockhash', [500000]);
    const block = await rpc.call('getblock', [blockHash]);

### Merkle Calculations

    import { calculateWTXID, getMerkleProof } from 'bitcoin-tx-proof';

    // Calculate witness txid
    const wtxid = calculateWTXID(transactionHex);

    // Generate merkle proof
    const proof = getMerkleProof(txHashes, txIndex);

## Error Handling

    try {
      const proof = await bitcoinTxProof(txid, blockHeight, rpcConfig);
    } catch (error) {
      if (error.message.includes('Invalid transaction ID')) {
        // Handle invalid txid
      } else if (error.message.includes('RPC Error')) {
        // Handle RPC connection issues
      } else if (error.message.includes('Transaction not found')) {
        // Handle missing transaction
      }
    }

## Performance Features

### Caching

- Built-in caching for RPC calls (10-minute TTL)
- Automatic cache invalidation
- Memory-efficient caching strategy

### Rate Limiting

- Automatic rate limiting (10 requests/second)
- Configurable limits
- Queue management for concurrent requests

## Development

    # Install dependencies
    npm install

    # Run tests
    npm test

    # Build
    npm run build

    # Lint
    npm run lint

    # Format code
    npm run format

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT
