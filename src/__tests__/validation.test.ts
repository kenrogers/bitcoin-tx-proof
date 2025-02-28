import { validateTxId, validateBlockHeight, validateRPCConfig } from '../validation';

describe('Input Validation', () => {
  test('validateTxId accepts valid transaction ID', () => {
    const validTxId = '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b';
    expect(() => validateTxId(validTxId)).not.toThrow();
  });

  test('validateTxId rejects invalid transaction ID', () => {
    const invalidTxId = 'invalid';
    expect(() => validateTxId(invalidTxId)).toThrow();
  });

  test('validateBlockHeight accepts valid height', () => {
    expect(() => validateBlockHeight(500000)).not.toThrow();
  });

  test('validateBlockHeight rejects negative height', () => {
    expect(() => validateBlockHeight(-1)).toThrow();
  });

  test('validateRPCConfig accepts valid config', () => {
    const validConfig = {
      url: 'http://localhost:8332',
      username: 'user',
      password: 'pass',
    };
    expect(() => validateRPCConfig(validConfig)).not.toThrow();
  });

  test('validateRPCConfig rejects invalid URL', () => {
    const invalidConfig = {
      url: 'invalid-url',
      username: 'user',
      password: 'pass',
    };
    expect(() => validateRPCConfig(invalidConfig)).toThrow();
  });
});
