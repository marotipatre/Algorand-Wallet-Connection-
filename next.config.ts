import type { NextConfig } from 'next'
import { webpackFallback } from '@txnlab/use-wallet-react'
 
const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        ...webpackFallback
      }
    }
    return config
  }
}
 
export default nextConfig