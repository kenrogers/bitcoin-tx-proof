declare module 'axios-rate-limit' {
  import { AxiosInstance } from 'axios';

  interface RateLimitOptions {
    maxRequests: number;
    perMilliseconds: number;
  }

  function rateLimit(instance: AxiosInstance, options: RateLimitOptions): AxiosInstance;
  export default rateLimit;
}
