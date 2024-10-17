"use client";

import React, { ReactNode, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider as SolWalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  CoinbaseWalletAdapter,
  MathWalletAdapter,
  Coin98WalletAdapter,
  CloverWalletAdapter,
  LedgerWalletAdapter,
  WalletConnectWalletAdapter,
  PhantomWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  // const endpoint = useMemo(() => "http://localhost:8899", []);
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new CoinbaseWalletAdapter(),
      new MathWalletAdapter(),
      new Coin98WalletAdapter(),
      new CloverWalletAdapter(),
      new LedgerWalletAdapter(),
      new WalletConnectWalletAdapter({ network, options: {} }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
          {/* Your app's components go here, nested within the context providers. */}
        </WalletModalProvider>
      </SolWalletProvider>
    </ConnectionProvider>
  );
};
