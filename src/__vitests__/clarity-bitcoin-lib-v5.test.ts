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
    "b8900af7ce01917fa9640ddcb8e3b985cc5602ba4d8d47bd702a1cfd92a54b9c";
  const rawTx =
    "0200000000010107d234bcb9763403fcb5c804d9a38d5cfccd9cb80cd46e12057b23ced1e2545e0000000000fdffffff025e570000000000001600142211d02a6f89d49f274384d7cfff0be15693fba29c079b1000000000160014192e80ed2c7c412bdc2a6c8f371d15cb90f3c85b0247304402200a9b5884eeef9011b5d30251d39540d7c164c0fb60242e1969a30de158f66abb02201c77b55fbd9fdeb9d8e4fee995723803ad7d7f4f585def9eb351512c55d2c9a1012103b01bd095f648ea829f000207087f16622431077bb5cc0875225ada601375c88500000000";
  const explorerApiTx = {
    txid: "b8900af7ce01917fa9640ddcb8e3b985cc5602ba4d8d47bd702a1cfd92a54b9c",
    hash: "fadeb6517b1fe9c31fcd96d56b2f3e90d1013cd9bd590d458c54ae6cd8745687",
    version: 2,
    size: 222,
    vsize: 141,
    weight: 561,
    locktime: 0,
    vin: [
      {
        txid: "5e54e2d1ce237b05126ed40cb89ccdfc5c8da3d904c8b5fc033476b9bc34d207",
        vout: 0,
        scriptSig: {
          asm: "",
          hex: "",
        },
        txinwitness: [
          "304402200a9b5884eeef9011b5d30251d39540d7c164c0fb60242e1969a30de158f66abb02201c77b55fbd9fdeb9d8e4fee995723803ad7d7f4f585def9eb351512c55d2c9a101",
          "03b01bd095f648ea829f000207087f16622431077bb5cc0875225ada601375c885",
        ],
        sequence: 4294967293,
      },
    ],
    vout: [
      {
        value: 0.00022366,
        n: 0,
        scriptPubKey: {
          asm: "0 2211d02a6f89d49f274384d7cfff0be15693fba2",
          desc: "addr(bc1qyggaq2n0382f7f6rsntullctu9tf87azqjjln6)#k4tk58qf",
          hex: "00142211d02a6f89d49f274384d7cfff0be15693fba2",
          address: "bc1qyggaq2n0382f7f6rsntullctu9tf87azqjjln6",
          type: "witness_v0_keyhash",
        },
      },
      {
        value: 2.78595484,
        n: 1,
        scriptPubKey: {
          asm: "0 192e80ed2c7c412bdc2a6c8f371d15cb90f3c85b",
          desc: "addr(bc1qryhgpmfv03qjhhp2dj8nw8g4ewg08jzmgy3cyx)#rumqegaa",
          hex: "0014192e80ed2c7c412bdc2a6c8f371d15cb90f3c85b",
          address: "bc1qryhgpmfv03qjhhp2dj8nw8g4ewg08jzmgy3cyx",
          type: "witness_v0_keyhash",
        },
      },
    ],
    hex: "0200000000010107d234bcb9763403fcb5c804d9a38d5cfccd9cb80cd46e12057b23ced1e2545e0000000000fdffffff025e570000000000001600142211d02a6f89d49f274384d7cfff0be15693fba29c079b1000000000160014192e80ed2c7c412bdc2a6c8f371d15cb90f3c85b0247304402200a9b5884eeef9011b5d30251d39540d7c164c0fb60242e1969a30de158f66abb02201c77b55fbd9fdeb9d8e4fee995723803ad7d7f4f585def9eb351512c55d2c9a1012103b01bd095f648ea829f000207087f16622431077bb5cc0875225ada601375c88500000000",
    blockhash:
      "000000000000000000012682cbf06d8e9ea176f52682a743896dbbf0774f09bb",
    confirmations: 191,
    time: 1739016401,
    blocktime: 1739016401,
  };

  const blockHeight = 882877;
  const stacksBlockHeight = 581021; // first stacks block after 882876 but anchored to 882878
  const coinbaseTxId =
    "04d599b2aa305544933aba815154a86fd109294990b034c6ab2f78e041e91eb7";
  const coinbaseTxRaw =
    "010000000001010000000000000000000000000000000000000000000000000000000000000000ffffffff630348790d046791a8677c204d415241204d61646520696e2055534120f09f87baf09f87b8207c763032fabe6d6d38d85a584baaf6fb55294f152cb402c8781f48aaa07a0b109146ef14269264530100000000000000139c9f06fd00cf300000ffffffffffffffff027d96b412000000001976a9142fc701e2049ee4957b07134b6c1d771dd5a96b2188ac0000000000000000266a24aa21a9ed2e1fb03d8dff026a9b7422846873b27330dcb66b770fd64d2f3960efb2ce1b840120000000000000000000000000000000000000000000000000000000000000000088bc2c16";
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
