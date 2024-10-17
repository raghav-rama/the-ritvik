"use client";

import styles from "./Testnet.module.scss";
import * as anchor from "@coral-xyz/anchor";
import { useState, useEffect } from "react";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import usdc from "./testnetTokenKeypairs/ST1Rwanemw4ULxNxChAjaoq9WcSyWQMaCDUHTvsaUMj.json";
import hsol from "./testnetTokenKeypairs/T1ELwFd2QCTSmvvnLHQHJxjgz7DwesA6gJLb9NPSwjY.json";
import msol from "./testnetTokenKeypairs/T2bB4xXTPLGWyniNVakbUfHNpzxeUVews3Jg5Et8gqP.json";
import jitosol from "./testnetTokenKeypairs/T3UnbTxgwGniAi6yiJyyrn2xzS8L4FEYWg4cK9bvyFt.json";
import sol from "./testnetTokenKeypairs/T4LX7z6yFMcjrRmcYVKczUV62aCHvKNpT7DRRj9Dfem.json";
import { PublicKey, LAMPORTS_PER_SOL, Transaction } from "@solana/web3.js";
import { Vaults } from "@/types/leverageFunVaults";
import {
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";

const testnetTokenKeyairs: anchor.web3.Keypair[] = [];
const tokenKeypairsJson = [
  JSON.stringify(usdc),
  JSON.stringify(hsol),
  JSON.stringify(msol),
  JSON.stringify(jitosol),
  JSON.stringify(sol),
];
for (const tokenKeypairJson of tokenKeypairsJson) {
  const secretKey = JSON.parse(tokenKeypairJson);
  const keypair = anchor.web3.Keypair.fromSecretKey(new Uint8Array(secretKey));
  testnetTokenKeyairs.push(keypair);
}

const wSol = new PublicKey("So11111111111111111111111111111111111111112");

export default function TestnetPage() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [mintTestnetSol, setMintTestnetSol] = useState<anchor.web3.Keypair>();
  const [solBalance, setSolBalance] = useState(0);
  const [tokenBalances, setTokenBalances] = useState<{ [key: string]: number }>(
    {}
  );
  const provider = new anchor.AnchorProvider(connection, wallet!);

  const handleMintDevnetSol = async () => {
    console.log("requesting airdrop");
    const signature = await connection.requestAirdrop(
      publicKey!,
      LAMPORTS_PER_SOL * 1
    );
    await provider.connection.confirmTransaction(signature);
  };

  const createMintToIxn = (
    mint: anchor.web3.PublicKey,
    destination: PublicKey,
    amount: number
  ) => {
    return createMintToInstruction(
      mint,
      destination,
      wallet!.publicKey!,
      amount,
      []
    );
  };

  const handleMintTestnetTokens = async (mint: PublicKey) => {
    // Check if the associated token account exists, if not create it
    let ata = await getAssociatedTokenAddress(mint, publicKey!);
    try {
      // Check if the account exists
      const account = await connection.getAccountInfo(ata);
      if (!account) {
        throw new Error("Account does not exist");
      }
    } catch (error) {
      console.log("ATA doesn't exist, creating a new one");
      const ix = createAssociatedTokenAccountInstruction(
        publicKey!,
        ata!,
        publicKey!,
        mint
      );
      const tx = new Transaction().add(ix);
      await provider.sendAndConfirm(tx);
    }

    // Create mint instruction
    const ix = createMintToIxn(mint, ata!, 10_000_000);

    const tx = new Transaction().add(ix);

    const txHash = await provider.sendAndConfirm(tx);

    await fetchTokenBalances();
  };

  const fetchTokenBalances = async () => {
    if (!publicKey) return;

    const balances: { [key: string]: number } = {};

    for (const tokenKeypair of testnetTokenKeyairs) {
      const tokenMint = tokenKeypair.publicKey;
      const ata = anchor.utils.token.associatedAddress({
        mint: tokenMint,
        owner: publicKey,
      });

      try {
        const balance = await connection.getTokenAccountBalance(ata);
        balances[tokenMint.toBase58()] =
          Number(balance.value.amount) / Math.pow(10, balance.value.decimals);
      } catch (error) {
        console.error(
          `Error fetching balance for ${tokenMint.toBase58()}:`,
          error
        );
        balances[tokenMint.toBase58()] = 0;
      }
    }

    setTokenBalances(balances);
  };
  useEffect(() => {
    (async () => {
      if (!publicKey) return;
      const solBalance = await connection.getBalance(publicKey);
      setSolBalance(solBalance / LAMPORTS_PER_SOL);
      await fetchTokenBalances();
    })();
  }, [publicKey]);

  return (
    <>
      <div className={styles["theme-dark"]}>
        <div className={styles["testnet-page"]}>
          <div className={styles["content"]}>
            <h1>Mint Testnet Tokens</h1>
            <h5>Tokens</h5>
            <h5>Balances</h5>
            <button
              onClick={async (e) =>
                await handleMintTestnetTokens(testnetTokenKeyairs[1].publicKey)
              }
            >
              Mint Testnet Sol
            </button>
            <div>
              {tokenBalances[testnetTokenKeyairs[1].publicKey.toBase58()] || 0}
            </div>
            <button
              onClick={async (e) =>
                await handleMintTestnetTokens(testnetTokenKeyairs[2].publicKey)
              }
            >
              Mint Testnet hSol
            </button>
            <div>
              {tokenBalances[testnetTokenKeyairs[2].publicKey.toBase58()] || 0}
            </div>
            <button
              onClick={async (e) =>
                await handleMintTestnetTokens(testnetTokenKeyairs[3].publicKey)
              }
            >
              Mint Testnet mSol
            </button>
            <div>
              {tokenBalances[testnetTokenKeyairs[3].publicKey.toBase58()] || 0}
            </div>
            <button
              onClick={async (e) =>
                await handleMintTestnetTokens(testnetTokenKeyairs[4].publicKey)
              }
            >
              Mint Testnet jitoSol
            </button>
            <div>
              {tokenBalances[testnetTokenKeyairs[4].publicKey.toBase58()] || 0}
            </div>
            <button
              onClick={async (e) =>
                await handleMintTestnetTokens(testnetTokenKeyairs[0].publicKey)
              }
            >
              Mint Testnet USDC
            </button>
            <div>
              {tokenBalances[testnetTokenKeyairs[0].publicKey.toBase58()] || 0}
            </div>
            <button onClick={async (e) => await handleMintDevnetSol()}>
              Mint Devnet SOL
            </button>
            <div>{solBalance.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </>
  );
}
