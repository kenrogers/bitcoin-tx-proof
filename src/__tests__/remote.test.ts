import { bitcoinTxProof } from "..";
import { BitcoinRPCConfig } from "../types";

describe("Use mainnet block 553724", () => {
  const rpcConfig: BitcoinRPCConfig = {
    url: "http://localhost:8332",
  };

  test("verify witness merkle root ", async () => {
    const proof = await bitcoinTxProof(
      "d367b86c0fa5cf0b7a202c41fdbb2e4e78314d50fdc12654b499bf33062f2f86",
      553724,
      rpcConfig
    );
    expect(proof.witnessMerkleRoot).toStrictEqual("dbee9a868a8caa2a1ddf683af1642a88dfb7ac7ce3ecb5d043586811a41fdbf2");
  });
});
