import { hexToBytes, projectFactory } from "@clarigen/core";
import { describe, test } from "vitest";
import { BitcoinRPCConfig, bitcoinTxProof } from "..";
import { BitcoinRPC } from "../rpc";
import { project } from "./clarigen-types";
import { rov } from "@clarigen/test";

const { clarityBitcoinLibV5 } = projectFactory(project, "simnet");

describe("Clarity Bitcoin Lib v5 verification", () => {
  // Using real Bitcoin transaction id from mainnet
  const txId =
    "bd725ba1fc3be138d2d62cd3ec4c7f55e2e33811ee1e5dbffd44e91686a233f3";
  const rawTx =
    "02000000000101695eb97b50eca9e08eb8fefec3b76eacae4795aaba529b5ff89829970b5fda2b0100000000fdffffff02e0c8100000000000160014da3337a038d08317ca6daf0ea1d377e4febb89995a111101000000001600140e105cbce363554cd67d77bfc1f50bb632b2c3fd0247304402201c7f73c5fccb4865335e8d72d927d68997452fb5e03260e65ac44f4f83b3aa22022024e26970fd2b616b57f604d92fd91e8d2e611650b2af3a84e670ff0074ccbc610121029e36010f142ece1a67893a5897b3b42f5b4f924ba35b1d94d84fc065c7786d7f46790d00";
  const explorerApiTx = {
    txid: "bd725ba1fc3be138d2d62cd3ec4c7f55e2e33811ee1e5dbffd44e91686a233f3",
    hash: "9eeaa10649e8947fef767422788d210d4de44187ba810c411ebfc1f2316ac41a",
    version: 2,
    size: 222,
    vsize: 141,
    weight: 561,
    locktime: 883014,
    vin: [
      {
        txid: "2bda5f0b972998f85f9b52baaa9547aeac6eb7c3fefeb88ee0a9ec507bb95e69",
        vout: 1,
        scriptSig: {
          asm: "",
          hex: "",
        },
        txinwitness: [
          "304402201c7f73c5fccb4865335e8d72d927d68997452fb5e03260e65ac44f4f83b3aa22022024e26970fd2b616b57f604d92fd91e8d2e611650b2af3a84e670ff0074ccbc6101",
          "029e36010f142ece1a67893a5897b3b42f5b4f924ba35b1d94d84fc065c7786d7f",
        ],
        sequence: 4294967293,
      },
    ],
    vout: [
      {
        value: 0.011,
        n: 0,
        scriptPubKey: {
          asm: "0 da3337a038d08317ca6daf0ea1d377e4febb8999",
          desc: "addr(bc1qmgen0gpc6zp30jnd4u82r5mhunlthzveu747zx)#7w9pt5f3",
          hex: "0014da3337a038d08317ca6daf0ea1d377e4febb8999",
          address: "bc1qmgen0gpc6zp30jnd4u82r5mhunlthzveu747zx",
          type: "witness_v0_keyhash",
        },
      },
      {
        value: 0.1789577,
        n: 1,
        scriptPubKey: {
          asm: "0 0e105cbce363554cd67d77bfc1f50bb632b2c3fd",
          desc: "addr(bc1qpcg9e08rvd25e4naw7luragtkcet9sla7nzjvs)#5cndh8w4",
          hex: "00140e105cbce363554cd67d77bfc1f50bb632b2c3fd",
          address: "bc1qpcg9e08rvd25e4naw7luragtkcet9sla7nzjvs",
          type: "witness_v0_keyhash",
        },
      },
    ],
    hex: "02000000000101695eb97b50eca9e08eb8fefec3b76eacae4795aaba529b5ff89829970b5fda2b0100000000fdffffff02e0c8100000000000160014da3337a038d08317ca6daf0ea1d377e4febb89995a111101000000001600140e105cbce363554cd67d77bfc1f50bb632b2c3fd0247304402201c7f73c5fccb4865335e8d72d927d68997452fb5e03260e65ac44f4f83b3aa22022024e26970fd2b616b57f604d92fd91e8d2e611650b2af3a84e670ff0074ccbc610121029e36010f142ece1a67893a5897b3b42f5b4f924ba35b1d94d84fc065c7786d7f46790d00",
    blockhash:
      "00000000000000000000ce2bb7d4eb76a893c41b480ce1617c5f2094221451e3",
    confirmations: 38,
    time: 1739100517,
    blocktime: 1739100517,
  };

  const blockHeight = 883016;
  const stacksBlockHeight = 586955;
  const rpcConfig: BitcoinRPCConfig = {
    url: "http://localhost:8332",
  };

  test("verify tx using Stacks", async () => {
    const proof = await bitcoinTxProof(txId, blockHeight, rpcConfig);
    const txObject = await new BitcoinRPC(rpcConfig).call("getrawtransaction", [
      txId,
    ]);
    console.log(proof);
    console.log(txObject);

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
