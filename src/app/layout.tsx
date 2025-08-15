'use client'
import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
} from "@solana/wallet-adapter-react-ui";
import { Toaster } from "react-hot-toast";

import "@solana/wallet-adapter-react-ui/styles.css";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const network = "https://api.devnet.solana.com";
  const endpoint = useMemo(() => network, [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    [network]
  );

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#1e293b',
                    color: '#e5e7eb',
                    border: '1px solid #475569',
                    fontFamily: 'monospace',
                  },
                  success: {
                    style: {
                      border: '1px solid #10b981',
                      background: '#064e3b',
                    },
                  },
                  error: {
                    style: {
                      border: '1px solid #ef4444',
                      background: '#7f1d1d',
                    },
                  },
                }}
              />
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </body>
    </html>
  );
}