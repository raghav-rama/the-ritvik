"use client";

import * as React from "react";
import Image from "next/image";

import { getProgram } from "@/utils/getProgram";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Vaults as LeverageFunVaults } from "@/types/leverageFunVaults";
import DepositModal from "./DespositModal";
import { useAppSelector } from "@/lib/hooks";
import { selectTheme } from "@/lib/features/theme/themeSlice";

import styles from "./Home.module.scss";

import usdc from "./testnetTokenKeypairs/ST1Rwanemw4ULxNxChAjaoq9WcSyWQMaCDUHTvsaUMj.json";
import sol from "./testnetTokenKeypairs/T1ELwFd2QCTSmvvnLHQHJxjgz7DwesA6gJLb9NPSwjY.json";
import hsol from "./testnetTokenKeypairs/T2bB4xXTPLGWyniNVakbUfHNpzxeUVews3Jg5Et8gqP.json";
import msol from "./testnetTokenKeypairs/T3UnbTxgwGniAi6yiJyyrn2xzS8L4FEYWg4cK9bvyFt.json";
import jitosol from "./testnetTokenKeypairs/T4LX7z6yFMcjrRmcYVKczUV62aCHvKNpT7DRRj9Dfem.json";
import { Keypair } from "@solana/web3.js";
import { getAndCreateAta } from "./helper";
import { getCoveredCallBaseVaultPda, getVaultLpMintPda } from "./pdas";
import Link from "next/link";

const testnetTokenKeyairs: { [key: string]: Keypair } = {};
const tokenKeypairsJson: { [key: string]: string } = {
  "usdc-vault": JSON.stringify(usdc),
  "solana-vault": JSON.stringify(sol),
  "helius-vault": JSON.stringify(hsol),
  "marinade-vault": JSON.stringify(msol),
  "jito-vault": JSON.stringify(jitosol),
};
for (const tokenKeypairId of Object.keys(tokenKeypairsJson)) {
  const tokenKeypairJson = tokenKeypairsJson[tokenKeypairId];
  const secretKey = JSON.parse(tokenKeypairJson);
  const keypair = Keypair.fromSecretKey(new Uint8Array(secretKey));
  testnetTokenKeyairs[tokenKeypairId] = keypair;
}
const VAULTS = [
  {
    id: "solana-vault",
    name: "Solana Vault",
    image: "/assets/sol.webp",
  },
  {
    id: "helius-vault",
    name: "Helius Vault",
    image: "/assets/hSol.webp",
  },
  {
    id: "marinade-vault",
    name: "Marinade Vault",
    image: "/assets/mSol.webp",
  },
  {
    id: "jito-vault",
    name: "Jito Vault",
    image: "/assets/jitoSol.webp",
  },
];

export default function HomePage() {
  const theme = useAppSelector(selectTheme);
  const wallet = useAnchorWallet();
  const [context, setContext] = React.useState<string>("");
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const { connection } = useConnection();
  const [program, setProgram] = React.useState<Program<LeverageFunVaults>>();
  const [underlyingKeypair, setUnderlyingKeypair] = React.useState<Keypair>();
  const [quoteKeypair, setQuoteKeypair] = React.useState<Keypair>();
  React.useMemo(() => {
    (async () => {
      const provider = new AnchorProvider(connection, wallet!);
      const program = await getProgram(provider);
      setProgram(program);
    })();
  }, [connection, wallet]);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };
  const handleTest = async () => {
    const [coveredCallBaseVault] = getCoveredCallBaseVaultPda(
      program!.programId,
      underlyingKeypair!.publicKey,
      quoteKeypair!.publicKey
    );
    const [vaultLpMint] = getVaultLpMintPda(
      program!.programId,
      coveredCallBaseVault
    );
    await getAndCreateAta(program!.provider, vaultLpMint, wallet!.publicKey);
  };

  return (
    <div className={styles[theme]}>
      <div className={styles["home-section"]}>
        This is the home page of Ritvik
        <Link target="_blank" href="https://github.com/raghav-rama">
          Github
        </Link>
      </div>
    </div>
  );
}
