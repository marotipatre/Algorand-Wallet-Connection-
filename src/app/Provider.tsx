'use client'


import { NetworkId, WalletId, WalletManager,WalletProvider } from '@txnlab/use-wallet-react';

const walletManager = new WalletManager({
    wallets: [
      WalletId.DEFLY,
      // WalletId.EXODUS,
      WalletId.PERA,
     {
        id: WalletId.WALLETCONNECT,
        options: { projectId: '86a36faefc623df46385759a9ed566ac' }
      },
      {
        id: WalletId.BIATEC,
        options: { projectId: 'fcfde0713d43baa0d23be0773c80a72b' }
      },
      WalletId.KMD,
      WalletId.KIBISIS,
      {
        id: WalletId.LUTE,
        options: { siteName: 'http://localhost:3000/' }
      },
      {
        id: WalletId.MAGIC,
        options: { apiKey: 'pk_live_E8C27696B36E9AF8' }
      }
    ],
    network: NetworkId.TESTNET
  })

  export function Providers({ children }: { children: React.ReactNode }) {
    return <WalletProvider manager={walletManager}>{children}</WalletProvider>
  }