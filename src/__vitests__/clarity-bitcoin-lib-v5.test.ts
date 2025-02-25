import { hexToBytes, projectFactory } from "@clarigen/core";
import { describe, expect, test } from "vitest";
import { BitcoinRPCConfig, bitcoinTxProof } from "..";
import { BitcoinRPC } from "../rpc";
import { project } from "./clarigen-types";
import { rov } from "@clarigen/test";

const { clarityBitcoinLibV5 } = projectFactory(project, "simnet");

describe("Clarity Bitcoin Lib v5 verification", () => {
  // Using real Bitcoin transaction id from mainnet
  const txId =
    "c1de234c01ecc47906117d012865ce3dabbbb081dc0309a74dbbae45e427aadc";

  const rawTx =
    "02000000000101f6e86a2b938453e199836ad4e2ba751c5ded24f4e1c2934b3434cd00f9bce61d0100000000fdffffff02856e00000000000017a914c5beca99b2b4c558b297ed9134142f4a3873f4e987d0b8390100000000160014b84ef1e7e398d56fa88a356df3139ff997114f040247304402205edad21077602766ffbce1276b6a3b69577a521b28dc18d8062303723ac91cc802200ec9ea72f62069b1e5817a999fa3d31acf0f655a159691feb8161fb33b93f3fa012103997651fec067eda2c430bfe548f65575737c9b892d8b529ae9dc0dfcb5c5898a00000000";
  const blockHeight = 883230;
  const stacksBlockHeight = 595050; // first stacks block after 882876 but anchored to 882878
  const rpcConfig: BitcoinRPCConfig = {
    url: "http://localhost:8332",
  };

  test("verify tx using Stacks", async () => {
    const proof = await bitcoinTxProof(txId, blockHeight, rpcConfig);
    console.log(proof.witnessMerkleProof);

    const txObject = await new BitcoinRPC(rpcConfig).call("getrawtransaction", [
      txId,
    ]);
    console.log(proof);
    console.log(txObject);
    console.log("cproof", proof.coinbaseMerkleProofArray);

    const header = rov(
      clarityBitcoinLibV5.verifyBlockHeader(
        hexToBytes(proof.blockHeader),
        blockHeight
      )
    );
    console.log({ header });

    expect(header).toBe(true);

    const valid = rov(
      clarityBitcoinLibV5.wasTxMinedCompact(
        blockHeight,
        hexToBytes(proof.coinbaseTransaction),
        hexToBytes(proof.blockHeader),
        {
          hashes: proof.coinbaseMerkleProofArray,
          txIndex: 0,
          treeDepth: proof.coinbaseMerkleProofArray.length,
        }
      )
    );

    console.log({ valid });

    const submission = rov(
      clarityBitcoinLibV5.wasSegwitTxMinedCompact(
        stacksBlockHeight,
        hexToBytes(rawTx),
        hexToBytes(proof.blockHeader),
        proof.txIndex,
        proof.merkleProofDepth,
        proof.witnessMerkleProofArray,
        hexToBytes(proof.witnessMerkleRoot),
        hexToBytes(proof.witnessReservedValue),
        hexToBytes(proof.coinbaseTransaction),
        proof.coinbaseMerkleProofArray
      )
    );
    console.log({ submission });
  });
}, 100_000);
