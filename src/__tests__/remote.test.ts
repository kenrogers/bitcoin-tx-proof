import { bitcoinTxProof } from '..';
import { BitcoinRPCConfig } from '../types';

describe('Use mainnet block 553724', () => {
  const rpcConfig: BitcoinRPCConfig = {
    url: 'http://192.168.129.114:8332',
    username: 'fivemonkeys',
    password: 'stackstacks',
  };

  test('verify witness merkle root ', async () => {
    const proof = await bitcoinTxProof(
      'd367b86c0fa5cf0b7a202c41fdbb2e4e78314d50fdc12654b499bf33062f2f86',
      553724,
      rpcConfig
    );
    expect(proof.witnessMerkleRoot).toStrictEqual(
      'dbee9a868a8caa2a1ddf683af1642a88dfb7ac7ce3ecb5d043586811a41fdbf2'
    );
    expect(proof.witnessMerkleProof).toStrictEqual(
      '00000000000000000000000000000000000000000000000000000000000000006b1dab5721b7b8d68b2c7f795d689998a35efed7e5c99e12e6c8d5c587a1628d'
    );
    expect(proof.coinbaseMerkleProof).toStrictEqual(
      '862f2f0633bf99b45426c1fd504d31784e2ebbfd412c207a0bcfa50f6cb867d3b26c9acdb850215e3bdc2888a24f8783be1ab416e94c5cc49f296f5a57a7bb3b'
    );
  });
});
