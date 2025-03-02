
import type { TypedAbiArg, TypedAbiFunction, TypedAbiVariable, Response } from '@clarigen/core';

export const contracts = {
  clarityBitcoinLibV5: {
  "functions": {
    boolListOfLen: {"name":"bool-list-of-len","access":"private","args":[{"name":"n","type":"uint128"}],"outputs":{"type":{"list":{"type":"bool","length":8}}}} as TypedAbiFunction<[n: TypedAbiArg<number | bigint, "n">], boolean[]>,
    innerMerkleProofVerify: {"name":"inner-merkle-proof-verify","access":"private","args":[{"name":"ctr","type":"uint128"},{"name":"state","type":{"tuple":[{"name":"cur-hash","type":{"buffer":{"length":32}}},{"name":"path","type":"uint128"},{"name":"proof-hashes","type":{"list":{"type":{"buffer":{"length":32}},"length":14}}},{"name":"root-hash","type":{"buffer":{"length":32}}},{"name":"tree-depth","type":"uint128"},{"name":"verified","type":"bool"}]}}],"outputs":{"type":{"tuple":[{"name":"cur-hash","type":{"buffer":{"length":32}}},{"name":"path","type":"uint128"},{"name":"proof-hashes","type":{"list":{"type":{"buffer":{"length":32}},"length":14}}},{"name":"root-hash","type":{"buffer":{"length":32}}},{"name":"tree-depth","type":"uint128"},{"name":"verified","type":"bool"}]}}} as TypedAbiFunction<[ctr: TypedAbiArg<number | bigint, "ctr">, state: TypedAbiArg<{
  "curHash": Uint8Array;
  "path": number | bigint;
  "proofHashes": Uint8Array[];
  "rootHash": Uint8Array;
  "treeDepth": number | bigint;
  "verified": boolean;
}, "state">], {
  "curHash": Uint8Array;
  "path": bigint;
  "proofHashes": Uint8Array[];
  "rootHash": Uint8Array;
  "treeDepth": bigint;
  "verified": boolean;
}>,
    reverseBuff16: {"name":"reverse-buff16","access":"private","args":[{"name":"input","type":{"buffer":{"length":16}}}],"outputs":{"type":{"buffer":{"length":17}}}} as TypedAbiFunction<[input: TypedAbiArg<Uint8Array, "input">], Uint8Array>,
    wasTxMinedInternal: {"name":"was-tx-mined-internal","access":"private","args":[{"name":"height","type":"uint128"},{"name":"tx","type":{"buffer":{"length":4096}}},{"name":"header","type":{"buffer":{"length":80}}},{"name":"merkle-root","type":{"buffer":{"length":32}}},{"name":"proof","type":{"tuple":[{"name":"hashes","type":{"list":{"type":{"buffer":{"length":32}},"length":14}}},{"name":"tree-depth","type":"uint128"},{"name":"tx-index","type":"uint128"}]}}],"outputs":{"type":{"response":{"ok":{"buffer":{"length":32}},"error":"uint128"}}}} as TypedAbiFunction<[height: TypedAbiArg<number | bigint, "height">, tx: TypedAbiArg<Uint8Array, "tx">, header: TypedAbiArg<Uint8Array, "header">, merkleRoot: TypedAbiArg<Uint8Array, "merkleRoot">, proof: TypedAbiArg<{
  "hashes": Uint8Array[];
  "treeDepth": number | bigint;
  "txIndex": number | bigint;
}, "proof">], Response<Uint8Array, bigint>>,
    getBcHHash: {"name":"get-bc-h-hash","access":"read_only","args":[{"name":"bh","type":"uint128"}],"outputs":{"type":{"optional":{"buffer":{"length":32}}}}} as TypedAbiFunction<[bh: TypedAbiArg<number | bigint, "bh">], Uint8Array | null>,
    getCommitmentScriptPubKey: {"name":"get-commitment-scriptPubKey","access":"read_only","args":[{"name":"outs","type":{"list":{"type":{"tuple":[{"name":"scriptPubKey","type":{"buffer":{"length":128}}},{"name":"value","type":"uint128"}]},"length":8}}}],"outputs":{"type":{"buffer":{"length":128}}}} as TypedAbiFunction<[outs: TypedAbiArg<{
  "scriptPubKey": Uint8Array;
  "value": number | bigint;
}[], "outs">], Uint8Array>,
    getReversedTxid: {"name":"get-reversed-txid","access":"read_only","args":[{"name":"tx","type":{"buffer":{"length":4096}}}],"outputs":{"type":{"buffer":{"length":32}}}} as TypedAbiFunction<[tx: TypedAbiArg<Uint8Array, "tx">], Uint8Array>,
    getTxid: {"name":"get-txid","access":"read_only","args":[{"name":"tx","type":{"buffer":{"length":4096}}}],"outputs":{"type":{"buffer":{"length":32}}}} as TypedAbiFunction<[tx: TypedAbiArg<Uint8Array, "tx">], Uint8Array>,
    innerGetCommitmentScriptPubKey: {"name":"inner-get-commitment-scriptPubKey","access":"read_only","args":[{"name":"out","type":{"tuple":[{"name":"scriptPubKey","type":{"buffer":{"length":128}}},{"name":"value","type":"uint128"}]}},{"name":"result","type":{"buffer":{"length":128}}}],"outputs":{"type":{"buffer":{"length":128}}}} as TypedAbiFunction<[out: TypedAbiArg<{
  "scriptPubKey": Uint8Array;
  "value": number | bigint;
}, "out">, result: TypedAbiArg<Uint8Array, "result">], Uint8Array>,
    isBitSet: {"name":"is-bit-set","access":"read_only","args":[{"name":"val","type":"uint128"},{"name":"bit","type":"uint128"}],"outputs":{"type":"bool"}} as TypedAbiFunction<[val: TypedAbiArg<number | bigint, "val">, bit: TypedAbiArg<number | bigint, "bit">], boolean>,
    isCommitmentPattern: {"name":"is-commitment-pattern","access":"read_only","args":[{"name":"scriptPubKey","type":{"buffer":{"length":128}}}],"outputs":{"type":"bool"}} as TypedAbiFunction<[scriptPubKey: TypedAbiArg<Uint8Array, "scriptPubKey">], boolean>,
    parseBlockHeader: {"name":"parse-block-header","access":"read_only","args":[{"name":"headerbuff","type":{"buffer":{"length":80}}}],"outputs":{"type":{"response":{"ok":{"tuple":[{"name":"merkle-root","type":{"buffer":{"length":32}}},{"name":"nbits","type":"uint128"},{"name":"nonce","type":"uint128"},{"name":"parent","type":{"buffer":{"length":32}}},{"name":"timestamp","type":"uint128"},{"name":"version","type":"uint128"}]},"error":"uint128"}}}} as TypedAbiFunction<[headerbuff: TypedAbiArg<Uint8Array, "headerbuff">], Response<{
  "merkleRoot": Uint8Array;
  "nbits": bigint;
  "nonce": bigint;
  "parent": Uint8Array;
  "timestamp": bigint;
  "version": bigint;
}, bigint>>,
    parseTx: {"name":"parse-tx","access":"read_only","args":[{"name":"tx","type":{"buffer":{"length":4096}}}],"outputs":{"type":{"response":{"ok":{"tuple":[{"name":"ins","type":{"list":{"type":{"tuple":[{"name":"outpoint","type":{"tuple":[{"name":"hash","type":{"buffer":{"length":32}}},{"name":"index","type":"uint128"}]}},{"name":"scriptSig","type":{"buffer":{"length":256}}},{"name":"sequence","type":"uint128"}]},"length":8}}},{"name":"locktime","type":"uint128"},{"name":"outs","type":{"list":{"type":{"tuple":[{"name":"scriptPubKey","type":{"buffer":{"length":128}}},{"name":"value","type":"uint128"}]},"length":8}}},{"name":"version","type":"uint128"}]},"error":"uint128"}}}} as TypedAbiFunction<[tx: TypedAbiArg<Uint8Array, "tx">], Response<{
  "ins": {
  "outpoint": {
  "hash": Uint8Array;
  "index": bigint;
};
  "scriptSig": Uint8Array;
  "sequence": bigint;
}[];
  "locktime": bigint;
  "outs": {
  "scriptPubKey": Uint8Array;
  "value": bigint;
}[];
  "version": bigint;
}, bigint>>,
    parseWtx: {"name":"parse-wtx","access":"read_only","args":[{"name":"tx","type":{"buffer":{"length":4096}}},{"name":"calculate-txid","type":"bool"}],"outputs":{"type":{"response":{"ok":{"tuple":[{"name":"ins","type":{"list":{"type":{"tuple":[{"name":"outpoint","type":{"tuple":[{"name":"hash","type":{"buffer":{"length":32}}},{"name":"index","type":"uint128"}]}},{"name":"scriptSig","type":{"buffer":{"length":256}}},{"name":"sequence","type":"uint128"}]},"length":8}}},{"name":"locktime","type":"uint128"},{"name":"outs","type":{"list":{"type":{"tuple":[{"name":"scriptPubKey","type":{"buffer":{"length":128}}},{"name":"value","type":"uint128"}]},"length":8}}},{"name":"segwit-marker","type":"uint128"},{"name":"segwit-version","type":"uint128"},{"name":"txid","type":{"optional":{"buffer":{"length":32}}}},{"name":"version","type":"uint128"},{"name":"witnesses","type":{"list":{"type":{"list":{"type":{"buffer":{"length":128}},"length":8}},"length":8}}}]},"error":"uint128"}}}} as TypedAbiFunction<[tx: TypedAbiArg<Uint8Array, "tx">, calculateTxid: TypedAbiArg<boolean, "calculateTxid">], Response<{
  "ins": {
  "outpoint": {
  "hash": Uint8Array;
  "index": bigint;
};
  "scriptSig": Uint8Array;
  "sequence": bigint;
}[];
  "locktime": bigint;
  "outs": {
  "scriptPubKey": Uint8Array;
  "value": bigint;
}[];
  "segwitMarker": bigint;
  "segwitVersion": bigint;
  "txid": Uint8Array | null;
  "version": bigint;
  "witnesses": Uint8Array[][];
}, bigint>>,
    readHashslice: {"name":"read-hashslice","access":"read_only","args":[{"name":"old-ctx","type":{"tuple":[{"name":"index","type":"uint128"},{"name":"txbuff","type":{"buffer":{"length":4096}}}]}}],"outputs":{"type":{"response":{"ok":{"tuple":[{"name":"ctx","type":{"tuple":[{"name":"index","type":"uint128"},{"name":"txbuff","type":{"buffer":{"length":4096}}}]}},{"name":"hashslice","type":{"buffer":{"length":32}}}]},"error":"uint128"}}}} as TypedAbiFunction<[oldCtx: TypedAbiArg<{
  "index": number | bigint;
  "txbuff": Uint8Array;
}, "oldCtx">], Response<{
  "ctx": {
  "index": bigint;
  "txbuff": Uint8Array;
};
  "hashslice": Uint8Array;
}, bigint>>,
    readNextItem: {"name":"read-next-item","access":"read_only","args":[{"name":"ignored","type":"bool"},{"name":"result","type":{"response":{"ok":{"tuple":[{"name":"ctx","type":{"tuple":[{"name":"index","type":"uint128"},{"name":"txbuff","type":{"buffer":{"length":4096}}}]}},{"name":"items","type":{"list":{"type":{"buffer":{"length":128}},"length":8}}}]},"error":"uint128"}}}],"outputs":{"type":{"response":{"ok":{"tuple":[{"name":"ctx","type":{"tuple":[{"name":"index","type":"uint128"},{"name":"txbuff","type":{"buffer":{"length":4096}}}]}},{"name":"items","type":{"list":{"type":{"buffer":{"length":128}},"length":8}}}]},"error":"uint128"}}}} as TypedAbiFunction<[ignored: TypedAbiArg<boolean, "ignored">, result: TypedAbiArg<Response<{
  "ctx": {
  "index": number | bigint;
  "txbuff": Uint8Array;
};
  "items": Uint8Array[];
}, number | bigint>, "result">], Response<{
  "ctx": {
  "index": bigint;
  "txbuff": Uint8Array;
};
  "items": Uint8Array[];
}, bigint>>,
    readNextTxin: {"name":"read-next-txin","access":"read_only","args":[{"name":"ignored","type":"bool"},{"name":"result","type":{"response":{"ok":{"tuple":[{"name":"ctx","type":{"tuple":[{"name":"index","type":"uint128"},{"name":"txbuff","type":{"buffer":{"length":4096}}}]}},{"name":"remaining","type":"uint128"},{"name":"txins","type":{"list":{"type":{"tuple":[{"name":"outpoint","type":{"tuple":[{"name":"hash","type":{"buffer":{"length":32}}},{"name":"index","type":"uint128"}]}},{"name":"scriptSig","type":{"buffer":{"length":256}}},{"name":"sequence","type":"uint128"}]},"length":8}}}]},"error":"uint128"}}}],"outputs":{"type":{"response":{"ok":{"tuple":[{"name":"ctx","type":{"tuple":[{"name":"index","type":"uint128"},{"name":"txbuff","type":{"buffer":{"length":4096}}}]}},{"name":"remaining","type":"uint128"},{"name":"txins","type":{"list":{"type":{"tuple":[{"name":"outpoint","type":{"tuple":[{"name":"hash","type":{"buffer":{"length":32}}},{"name":"index","type":"uint128"}]}},{"name":"scriptSig","type":{"buffer":{"length":256}}},{"name":"sequence","type":"uint128"}]},"length":8}}}]},"error":"uint128"}}}} as TypedAbiFunction<[ignored: TypedAbiArg<boolean, "ignored">, result: TypedAbiArg<Response<{
  "ctx": {
  "index": number | bigint;
  "txbuff": Uint8Array;
};
  "remaining": number | bigint;
  "txins": {
  "outpoint": {
  "hash": Uint8Array;
  "index": number | bigint;
};
  "scriptSig": Uint8Array;
  "sequence": number | bigint;
}[];
}, number | bigint>, "result">], Response<{
  "ctx": {
  "index": bigint;
  "txbuff": Uint8Array;
};
  "remaining": bigint;
  "txins": {
  "outpoint": {
  "hash": Uint8Array;
  "index": bigint;
};
  "scriptSig": Uint8Array;
  "sequence": bigint;
}[];
}, bigint>>,
    readNextTxout: {"name":"read-next-txout","access":"read_only","args":[{"name":"ignored","type":"bool"},{"name":"result","type":{"response":{"ok":{"tuple":[{"name":"ctx","type":{"tuple":[{"name":"index","type":"uint128"},{"name":"txbuff","type":{"buffer":{"length":4096}}}]}},{"name":"txouts","type":{"list":{"type":{"tuple":[{"name":"scriptPubKey","type":{"buffer":{"length":128}}},{"name":"value","type":"uint128"}]},"length":8}}}]},"error":"uint128"}}}],"outputs":{"type":{"response":{"ok":{"tuple":[{"name":"ctx","type":{"tuple":[{"name":"index","type":"uint128"},{"name":"txbuff","type":{"buffer":{"length":4096}}}]}},{"name":"txouts","type":{"list":{"type":{"tuple":[{"name":"scriptPubKey","type":{"buffer":{"length":128}}},{"name":"value","type":"uint128"}]},"length":8}}}]},"error":"uint128"}}}} as TypedAbiFunction<[ignored: TypedAbiArg<boolean, "ignored">, result: TypedAbiArg<Response<{
  "ctx": {
  "index": number | bigint;
  "txbuff": Uint8Array;
};
  "txouts": {
  "scriptPubKey": Uint8Array;
  "value": number | bigint;
}[];
}, number | bigint>, "result">], Response<{
  "ctx": {
  "index": bigint;
  "txbuff": Uint8Array;
};
  "txouts": {
  "scriptPubKey": Uint8Array;
  "value": bigint;
}[];
}, bigint>>,
    readNextWitness: {"name":"read-next-witness","access":"read_only","args":[{"name":"ignored","type":"bool"},{"name":"result","type":{"response":{"ok":{"tuple":[{"name":"ctx","type":{"tuple":[{"name":"index","type":"uint128"},{"name":"txbuff","type":{"buffer":{"length":4096}}}]}},{"name":"witnesses","type":{"list":{"type":{"list":{"type":{"buffer":{"length":128}},"length":8}},"length":8}}}]},"error":"uint128"}}}],"outputs":{"type":{"response":{"ok":{"tuple":[{"name":"ctx","type":{"tuple":[{"name":"index","type":"uint128"},{"name":"txbuff","type":{"buffer":{"length":4096}}}]}},{"name":"witnesses","type":{"list":{"type":{"list":{"type":{"buffer":{"length":128}},"length":8}},"length":8}}}]},"error":"uint128"}}}} as TypedAbiFunction<[ignored: TypedAbiArg<boolean, "ignored">, result: TypedAbiArg<Response<{
  "ctx": {
  "index": number | bigint;
  "txbuff": Uint8Array;
};
  "witnesses": Uint8Array[][];
}, number | bigint>, "result">], Response<{
  "ctx": {
  "index": bigint;
  "txbuff": Uint8Array;
};
  "witnesses": Uint8Array[][];
}, bigint>>,
    readTxins: {"name":"read-txins","access":"read_only","args":[{"name":"ctx","type":{"tuple":[{"name":"index","type":"uint128"},{"name":"txbuff","type":{"buffer":{"length":4096}}}]}}],"outputs":{"type":{"response":{"ok":{"tuple":[{"name":"ctx","type":{"tuple":[{"name":"index","type":"uint128"},{"name":"txbuff","type":{"buffer":{"length":4096}}}]}},{"name":"remaining","type":"uint128"},{"name":"txins","type":{"list":{"type":{"tuple":[{"name":"outpoint","type":{"tuple":[{"name":"hash","type":{"buffer":{"length":32}}},{"name":"index","type":"uint128"}]}},{"name":"scriptSig","type":{"buffer":{"length":256}}},{"name":"sequence","type":"uint128"}]},"length":8}}}]},"error":"uint128"}}}} as TypedAbiFunction<[ctx: TypedAbiArg<{
  "index": number | bigint;
  "txbuff": Uint8Array;
}, "ctx">], Response<{
  "ctx": {
  "index": bigint;
  "txbuff": Uint8Array;
};
  "remaining": bigint;
  "txins": {
  "outpoint": {
  "hash": Uint8Array;
  "index": bigint;
};
  "scriptSig": Uint8Array;
  "sequence": bigint;
}[];
}, bigint>>,
    readTxouts: {"name":"read-txouts","access":"read_only","args":[{"name":"ctx","type":{"tuple":[{"name":"index","type":"uint128"},{"name":"txbuff","type":{"buffer":{"length":4096}}}]}}],"outputs":{"type":{"response":{"ok":{"tuple":[{"name":"ctx","type":{"tuple":[{"name":"index","type":"uint128"},{"name":"txbuff","type":{"buffer":{"length":4096}}}]}},{"name":"txouts","type":{"list":{"type":{"tuple":[{"name":"scriptPubKey","type":{"buffer":{"length":128}}},{"name":"value","type":"uint128"}]},"length":8}}}]},"error":"uint128"}}}} as TypedAbiFunction<[ctx: TypedAbiArg<{
  "index": number | bigint;
  "txbuff": Uint8Array;
}, "ctx">], Response<{
  "ctx": {
  "index": bigint;
  "txbuff": Uint8Array;
};
  "txouts": {
  "scriptPubKey": Uint8Array;
  "value": bigint;
}[];
}, bigint>>,
    readUint16: {"name":"read-uint16","access":"read_only","args":[{"name":"ctx","type":{"tuple":[{"name":"index","type":"uint128"},{"name":"txbuff","type":{"buffer":{"length":4096}}}]}}],"outputs":{"type":{"response":{"ok":{"tuple":[{"name":"ctx","type":{"tuple":[{"name":"index","type":"uint128"},{"name":"txbuff","type":{"buffer":{"length":4096}}}]}},{"name":"uint16","type":"uint128"}]},"error":"uint128"}}}} as TypedAbiFunction<[ctx: TypedAbiArg<{
  "index": number | bigint;
  "txbuff": Uint8Array;
}, "ctx">], Response<{
  "ctx": {
  "index": bigint;
  "txbuff": Uint8Array;
};
  "uint16": bigint;
}, bigint>>,
    readUint32: {"name":"read-uint32","access":"read_only","args":[{"name":"ctx","type":{"tuple":[{"name":"index","type":"uint128"},{"name":"txbuff","type":{"buffer":{"length":4096}}}]}}],"outputs":{"type":{"response":{"ok":{"tuple":[{"name":"ctx","type":{"tuple":[{"name":"index","type":"uint128"},{"name":"txbuff","type":{"buffer":{"length":4096}}}]}},{"name":"uint32","type":"uint128"}]},"error":"uint128"}}}} as TypedAbiFunction<[ctx: TypedAbiArg<{
  "index": number | bigint;
  "txbuff": Uint8Array;
}, "ctx">], Response<{
  "ctx": {
  "index": bigint;
  "txbuff": Uint8Array;
};
  "uint32": bigint;
}, bigint>>,
    readUint64: {"name":"read-uint64","access":"read_only","args":[{"name":"ctx","type":{"tuple":[{"name":"index","type":"uint128"},{"name":"txbuff","type":{"buffer":{"length":4096}}}]}}],"outputs":{"type":{"response":{"ok":{"tuple":[{"name":"ctx","type":{"tuple":[{"name":"index","type":"uint128"},{"name":"txbuff","type":{"buffer":{"length":4096}}}]}},{"name":"uint64","type":"uint128"}]},"error":"uint128"}}}} as TypedAbiFunction<[ctx: TypedAbiArg<{
  "index": number | bigint;
  "txbuff": Uint8Array;
}, "ctx">], Response<{
  "ctx": {
  "index": bigint;
  "txbuff": Uint8Array;
};
  "uint64": bigint;
}, bigint>>,
    readUint8: {"name":"read-uint8","access":"read_only","args":[{"name":"ctx","type":{"tuple":[{"name":"index","type":"uint128"},{"name":"txbuff","type":{"buffer":{"length":4096}}}]}}],"outputs":{"type":{"response":{"ok":{"tuple":[{"name":"ctx","type":{"tuple":[{"name":"index","type":"uint128"},{"name":"txbuff","type":{"buffer":{"length":4096}}}]}},{"name":"uint8","type":"uint128"}]},"error":"uint128"}}}} as TypedAbiFunction<[ctx: TypedAbiArg<{
  "index": number | bigint;
  "txbuff": Uint8Array;
}, "ctx">], Response<{
  "ctx": {
  "index": bigint;
  "txbuff": Uint8Array;
};
  "uint8": bigint;
}, bigint>>,
    readVarint: {"name":"read-varint","access":"read_only","args":[{"name":"ctx","type":{"tuple":[{"name":"index","type":"uint128"},{"name":"txbuff","type":{"buffer":{"length":4096}}}]}}],"outputs":{"type":{"response":{"ok":{"tuple":[{"name":"ctx","type":{"tuple":[{"name":"index","type":"uint128"},{"name":"txbuff","type":{"buffer":{"length":4096}}}]}},{"name":"varint","type":"uint128"}]},"error":"uint128"}}}} as TypedAbiFunction<[ctx: TypedAbiArg<{
  "index": number | bigint;
  "txbuff": Uint8Array;
}, "ctx">], Response<{
  "ctx": {
  "index": bigint;
  "txbuff": Uint8Array;
};
  "varint": bigint;
}, bigint>>,
    readVarslice: {"name":"read-varslice","access":"read_only","args":[{"name":"old-ctx","type":{"tuple":[{"name":"index","type":"uint128"},{"name":"txbuff","type":{"buffer":{"length":4096}}}]}}],"outputs":{"type":{"response":{"ok":{"tuple":[{"name":"ctx","type":{"tuple":[{"name":"index","type":"uint128"},{"name":"txbuff","type":{"buffer":{"length":4096}}}]}},{"name":"varslice","type":{"buffer":{"length":4096}}}]},"error":"uint128"}}}} as TypedAbiFunction<[oldCtx: TypedAbiArg<{
  "index": number | bigint;
  "txbuff": Uint8Array;
}, "oldCtx">], Response<{
  "ctx": {
  "index": bigint;
  "txbuff": Uint8Array;
};
  "varslice": Uint8Array;
}, bigint>>,
    readWitnesses: {"name":"read-witnesses","access":"read_only","args":[{"name":"ctx","type":{"tuple":[{"name":"index","type":"uint128"},{"name":"txbuff","type":{"buffer":{"length":4096}}}]}},{"name":"num-txins","type":"uint128"}],"outputs":{"type":{"response":{"ok":{"tuple":[{"name":"ctx","type":{"tuple":[{"name":"index","type":"uint128"},{"name":"txbuff","type":{"buffer":{"length":4096}}}]}},{"name":"witnesses","type":{"list":{"type":{"list":{"type":{"buffer":{"length":128}},"length":8}},"length":8}}}]},"error":"uint128"}}}} as TypedAbiFunction<[ctx: TypedAbiArg<{
  "index": number | bigint;
  "txbuff": Uint8Array;
}, "ctx">, numTxins: TypedAbiArg<number | bigint, "numTxins">], Response<{
  "ctx": {
  "index": bigint;
  "txbuff": Uint8Array;
};
  "witnesses": Uint8Array[][];
}, bigint>>,
    reverseBuff32: {"name":"reverse-buff32","access":"read_only","args":[{"name":"input","type":{"buffer":{"length":32}}}],"outputs":{"type":{"buffer":{"length":32}}}} as TypedAbiFunction<[input: TypedAbiArg<Uint8Array, "input">], Uint8Array>,
    verifyBlockHeader: {"name":"verify-block-header","access":"read_only","args":[{"name":"headerbuff","type":{"buffer":{"length":80}}},{"name":"expected-block-height","type":"uint128"}],"outputs":{"type":"bool"}} as TypedAbiFunction<[headerbuff: TypedAbiArg<Uint8Array, "headerbuff">, expectedBlockHeight: TypedAbiArg<number | bigint, "expectedBlockHeight">], boolean>,
    verifyMerkleProof: {"name":"verify-merkle-proof","access":"read_only","args":[{"name":"reversed-txid","type":{"buffer":{"length":32}}},{"name":"merkle-root","type":{"buffer":{"length":32}}},{"name":"proof","type":{"tuple":[{"name":"hashes","type":{"list":{"type":{"buffer":{"length":32}},"length":14}}},{"name":"tree-depth","type":"uint128"},{"name":"tx-index","type":"uint128"}]}}],"outputs":{"type":{"response":{"ok":"bool","error":"uint128"}}}} as TypedAbiFunction<[reversedTxid: TypedAbiArg<Uint8Array, "reversedTxid">, merkleRoot: TypedAbiArg<Uint8Array, "merkleRoot">, proof: TypedAbiArg<{
  "hashes": Uint8Array[];
  "treeDepth": number | bigint;
  "txIndex": number | bigint;
}, "proof">], Response<boolean, bigint>>,
    wasSegwitTxMinedCompact: {"name":"was-segwit-tx-mined-compact","access":"read_only","args":[{"name":"height","type":"uint128"},{"name":"wtx","type":{"buffer":{"length":4096}}},{"name":"header","type":{"buffer":{"length":80}}},{"name":"tx-index","type":"uint128"},{"name":"tree-depth","type":"uint128"},{"name":"wproof","type":{"list":{"type":{"buffer":{"length":32}},"length":14}}},{"name":"witness-merkle-root","type":{"buffer":{"length":32}}},{"name":"witness-reserved-value","type":{"buffer":{"length":32}}},{"name":"ctx","type":{"buffer":{"length":1024}}},{"name":"cproof","type":{"list":{"type":{"buffer":{"length":32}},"length":14}}}],"outputs":{"type":{"response":{"ok":{"buffer":{"length":32}},"error":"uint128"}}}} as TypedAbiFunction<[height: TypedAbiArg<number | bigint, "height">, wtx: TypedAbiArg<Uint8Array, "wtx">, header: TypedAbiArg<Uint8Array, "header">, txIndex: TypedAbiArg<number | bigint, "txIndex">, treeDepth: TypedAbiArg<number | bigint, "treeDepth">, wproof: TypedAbiArg<Uint8Array[], "wproof">, witnessMerkleRoot: TypedAbiArg<Uint8Array, "witnessMerkleRoot">, witnessReservedValue: TypedAbiArg<Uint8Array, "witnessReservedValue">, ctx: TypedAbiArg<Uint8Array, "ctx">, cproof: TypedAbiArg<Uint8Array[], "cproof">], Response<Uint8Array, bigint>>,
    wasTxMinedCompact: {"name":"was-tx-mined-compact","access":"read_only","args":[{"name":"height","type":"uint128"},{"name":"tx","type":{"buffer":{"length":4096}}},{"name":"header","type":{"buffer":{"length":80}}},{"name":"proof","type":{"tuple":[{"name":"hashes","type":{"list":{"type":{"buffer":{"length":32}},"length":14}}},{"name":"tree-depth","type":"uint128"},{"name":"tx-index","type":"uint128"}]}}],"outputs":{"type":{"response":{"ok":{"buffer":{"length":32}},"error":"uint128"}}}} as TypedAbiFunction<[height: TypedAbiArg<number | bigint, "height">, tx: TypedAbiArg<Uint8Array, "tx">, header: TypedAbiArg<Uint8Array, "header">, proof: TypedAbiArg<{
  "hashes": Uint8Array[];
  "treeDepth": number | bigint;
  "txIndex": number | bigint;
}, "proof">], Response<Uint8Array, bigint>>
  },
  "maps": {
    
  },
  "variables": {
    ERR_BAD_HEADER: {
  name: 'ERR-BAD-HEADER',
  type: 'uint128',
  access: 'constant'
} as TypedAbiVariable<bigint>,
    ERR_HEADER_HEIGHT_MISMATCH: {
  name: 'ERR-HEADER-HEIGHT-MISMATCH',
  type: 'uint128',
  access: 'constant'
} as TypedAbiVariable<bigint>,
    ERR_INVALID_COMMITMENT: {
  name: 'ERR-INVALID-COMMITMENT',
  type: 'uint128',
  access: 'constant'
} as TypedAbiVariable<bigint>,
    ERR_INVALID_MERKLE_PROOF: {
  name: 'ERR-INVALID-MERKLE-PROOF',
  type: 'uint128',
  access: 'constant'
} as TypedAbiVariable<bigint>,
    ERR_LEFTOVER_DATA: {
  name: 'ERR-LEFTOVER-DATA',
  type: 'uint128',
  access: 'constant'
} as TypedAbiVariable<bigint>,
    ERR_NOT_SEGWIT_TRANSACTION: {
  name: 'ERR-NOT-SEGWIT-TRANSACTION',
  type: 'uint128',
  access: 'constant'
} as TypedAbiVariable<bigint>,
    ERR_OUT_OF_BOUNDS: {
  name: 'ERR-OUT-OF-BOUNDS',
  type: 'uint128',
  access: 'constant'
} as TypedAbiVariable<bigint>,
    ERR_PROOF_TOO_SHORT: {
  name: 'ERR-PROOF-TOO-SHORT',
  type: 'uint128',
  access: 'constant'
} as TypedAbiVariable<bigint>,
    ERR_TOO_MANY_TXINS: {
  name: 'ERR-TOO-MANY-TXINS',
  type: 'uint128',
  access: 'constant'
} as TypedAbiVariable<bigint>,
    ERR_TOO_MANY_TXOUTS: {
  name: 'ERR-TOO-MANY-TXOUTS',
  type: 'uint128',
  access: 'constant'
} as TypedAbiVariable<bigint>,
    ERR_TOO_MANY_WITNESSES: {
  name: 'ERR-TOO-MANY-WITNESSES',
  type: 'uint128',
  access: 'constant'
} as TypedAbiVariable<bigint>,
    ERR_VARSLICE_TOO_LONG: {
  name: 'ERR-VARSLICE-TOO-LONG',
  type: 'uint128',
  access: 'constant'
} as TypedAbiVariable<bigint>,
    ERR_WITNESS_TX_NOT_IN_COMMITMENT: {
  name: 'ERR-WITNESS-TX-NOT-IN-COMMITMENT',
  type: 'uint128',
  access: 'constant'
} as TypedAbiVariable<bigint>
  },
  constants: {},
  "non_fungible_tokens": [
    
  ],
  "fungible_tokens":[],"epoch":"Epoch24","clarity_version":"Clarity2",
  contractName: 'clarity-bitcoin-lib-v5',
  }
} as const;

export const accounts = {"deployer":{"address":"ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM","balance":"100000000000000"},"faucet":{"address":"STNHKEPYEPJ8ET55ZZ0M5A34J0R3N5FM2CMMMAZ6","balance":"100000000000000"},"wallet_1":{"address":"ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5","balance":"100000000000000"},"wallet_2":{"address":"ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG","balance":"100000000000000"},"wallet_3":{"address":"ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC","balance":"100000000000000"},"wallet_4":{"address":"ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND","balance":"100000000000000"},"wallet_5":{"address":"ST2REHHS5J3CERCRBEPMGH7921Q6PYKAADT7JP2VB","balance":"100000000000000"},"wallet_6":{"address":"ST3AM1A56AK2C1XAFJ4115ZSV26EB49BVQ10MGCS0","balance":"100000000000000"},"wallet_7":{"address":"ST3PF13W7Z0RRM42A8VZRVFQ75SV1K26RXEP8YGKJ","balance":"100000000000000"},"wallet_8":{"address":"ST3NBRSFKX28FQ2ZJ1MAKX58HKHSDGNV5N7R21XCP","balance":"100000000000000"}} as const;

export const identifiers = {"clarityBitcoinLibV5":"SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.clarity-bitcoin-lib-v5"} as const

export const simnet = {
  accounts,
  contracts,
  identifiers,
} as const;


export const deployments = {"clarityBitcoinLibV5":{"devnet":"ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.clarity-bitcoin-lib-v5","simnet":"SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.clarity-bitcoin-lib-v5","testnet":null,"mainnet":"SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.clarity-bitcoin-lib-v5"}} as const;

export const project = {
  contracts,
  deployments,
} as const;
  