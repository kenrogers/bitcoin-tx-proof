import axios, { AxiosError } from 'axios';
import RateLimit from 'axios-rate-limit';
import NodeCache from 'node-cache';
import { BitcoinRPCConfig } from './types';

const DEBUG = process.env.DEBUG === 'true';

function debug(...args: any[]) {
  if (DEBUG) {
    console.log('\x1b[35m[RPC]\x1b[0m', ...args); // Magenta color for RPC logs
  }
}

export class BitcoinRPC {
  private url: string;
  private auth?: { username: string; password: string };
  private cache: NodeCache;
  private axiosInstance;

  constructor(config: BitcoinRPCConfig) {
    this.url = config.url;
    if (config.username && config.password) {
      this.auth = {
        username: config.username,
        password: config.password,
      };
    }
    this.cache = new NodeCache({ stdTTL: 600 }); // 10 minute cache
    this.axiosInstance = RateLimit(axios.create(), {
      maxRequests: 10,
      perMilliseconds: 1000,
    });
  }

  async call(method: string, params: any[] = []): Promise<any> {
    const cacheKey = `${method}-${JSON.stringify(params)}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      debug('Cache hit for:', method, params);
      return cached;
    }

    debug('Making RPC call:', method, params);
    try {
      const response = await this.axiosInstance.post(
        this.url,
        {
          jsonrpc: '2.0',
          id: 'bitcointxproof',
          method,
          params,
        },
        {
          auth: this.auth,
          headers: { 'Content-Type': 'application/json' },
        }
      );

      debug('RPC response:', response.data);

      if (response.data.error) {
        throw new Error(`RPC Error: ${response.data.error.message}`);
      }

      this.cache.set(cacheKey, response.data.result);
      return response.data.result;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          debug('RPC Error Response:', {
            status: axiosError.response.status,
            statusText: axiosError.response.statusText,
            data: axiosError.response.data,
          });
          throw new Error(
            `RPC Error (${axiosError.response.status}): ${JSON.stringify(axiosError.response.data)}`
          );
        } else if (axiosError.request) {
          debug('RPC Request Error:', axiosError.message);
          throw new Error(`RPC Request Failed: ${axiosError.message}`);
        }
      }
      debug('Unexpected RPC Error:', error);
      throw error;
    }
  }
}
