import { BitcoinRPC } from '../rpc';
import axios, { AxiosInstance } from 'axios';
import RateLimit from 'axios-rate-limit';

jest.mock('axios');
jest.mock('axios-rate-limit');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedRateLimit = RateLimit as jest.MockedFunction<typeof RateLimit>;

type MockedRateLimitedAxios = AxiosInstance & {
  getQueue: jest.Mock;
  getMaxRPS: jest.Mock;
  setMaxRPS: jest.Mock;
  setRateLimitOptions: jest.Mock;
};

describe('BitcoinRPC', () => {
  const config = {
    url: 'http://localhost:8332',
    username: 'user',
    password: 'pass',
  };

  let mockPost: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockPost = jest.fn();

    // Create properly typed mock with the required function signature
    const mockRateLimitedAxios = {
      defaults: {},
      interceptors: {
        request: { use: jest.fn(), eject: jest.fn(), clear: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn(), clear: jest.fn() },
      },
      getUri: jest.fn(),
      request: jest.fn(),
      get: jest.fn(),
      delete: jest.fn(),
      head: jest.fn(),
      options: jest.fn(),
      post: mockPost,
      put: jest.fn(),
      patch: jest.fn(),
      postForm: jest.fn(),
      putForm: jest.fn(),
      patchForm: jest.fn(),
      getQueue: jest.fn(),
      getMaxRPS: jest.fn(),
      setMaxRPS: jest.fn(),
      setRateLimitOptions: jest.fn(),
    } as unknown as MockedRateLimitedAxios;

    mockedRateLimit.mockReturnValue(mockRateLimitedAxios);
    mockedAxios.create.mockReturnValue(mockRateLimitedAxios);
  });

  test('successful RPC call', async () => {
    const rpc = new BitcoinRPC(config);
    const mockResponse = { data: { result: 'success', error: null } };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await rpc.call('getblock', ['123']);
    expect(result).toBe('success');
  });

  test('handles RPC error', async () => {
    const rpc = new BitcoinRPC(config);
    const mockResponse = { data: { error: { message: 'RPC error' } } };
    mockPost.mockResolvedValueOnce(mockResponse);

    await expect(rpc.call('getblock', ['123'])).rejects.toThrow('RPC Error: RPC error');
  });

  test('uses cache for repeated calls', async () => {
    const rpc = new BitcoinRPC(config);
    const mockResponse = { data: { result: 'success', error: null } };
    mockPost.mockResolvedValueOnce(mockResponse);

    await rpc.call('getblock', ['123']);
    await rpc.call('getblock', ['123']);

    expect(mockPost).toHaveBeenCalledTimes(1);
  });
});
