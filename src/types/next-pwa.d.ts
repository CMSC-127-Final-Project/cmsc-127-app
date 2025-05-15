declare module 'next-pwa' {
  import { NextConfig } from 'next';
  import { PWAOptions } from '../utils/types';

  const withPWA: (options: PWAOptions) => (nextConfig: NextConfig) => NextConfig;
  export default withPWA;
}
