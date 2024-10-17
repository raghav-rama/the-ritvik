import * as anchor from "@coral-xyz/anchor";
import { Vaults } from "@/types/leverageFunVaults";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  createTokenMint,
  getAndCreateAta,
  mintSomeTokens,
  asV0Transaction,
} from "./helper";
import {
  getPoolAuthorityPda,
  getVaultLpMintPda,
  getVaultMintAuthorityPda,
} from "./pdas";
import { getCoveredCallBaseVaultPda } from "./pdas";
import { SystemProgram } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";

const underlyingMintKeypair = anchor.web3.Keypair.generate();
const quoteMintKeypair = anchor.web3.Keypair.generate();

export async function createVault(
  program: Program<Vaults>,
  setContext: (state: string) => void
) {
  if (!program.provider.publicKey || !program.provider.sendAndConfirm) {
    throw new Error("Provider public key is undefined");
  }

  try {
    // initialize underlying and quote tokens
    await createTokenMint(
      program.provider,
      underlyingMintKeypair,
      program.provider.publicKey,
      6
    );
    setContext(`underlying mint created ${underlyingMintKeypair.publicKey}`);
    await createTokenMint(
      program.provider,
      quoteMintKeypair,
      program.provider.publicKey,
      6
    );
    setContext(`quote mint created ${quoteMintKeypair.publicKey}`);
    // initialize pools for the underlying and quote tokens
    // for the owner of the vault
    const { ataAddress: underlyingPoolAtaOwner } = await getAndCreateAta(
      program.provider,
      underlyingMintKeypair.publicKey,
      program.provider.publicKey
    );
    setContext(
      `underlying pool for payer (ATA) created ${underlyingPoolAtaOwner}`
    );
    const { ataAddress: quotePoolAtaOwner } = await getAndCreateAta(
      program.provider,
      quoteMintKeypair.publicKey,
      program.provider.publicKey
    );
    setContext(`quote pool for payer (ATA) created ${quotePoolAtaOwner}`);
    // for the solana program
    const [poolAuthority] = getPoolAuthorityPda(program.programId);
    const { ataAddress: underlyingPoolAtaProgram } = await getAndCreateAta(
      program.provider,
      underlyingMintKeypair.publicKey,
      poolAuthority,
      true
    );
    setContext(
      `underlying pool for the program(ATA) created ${underlyingPoolAtaProgram}`
    );
    const { ataAddress: quotePoolAtaProgram } = await getAndCreateAta(
      program.provider,
      quoteMintKeypair.publicKey,
      poolAuthority,
      true
    );
    setContext(
      `quote pool for the program (ATA) created ${quotePoolAtaProgram}`
    );
    // Mint some tokens
    await mintSomeTokens(
      program.provider,
      underlyingMintKeypair.publicKey,
      underlyingPoolAtaOwner,
      10_000_000
    );
    setContext(`10 underlying minted`);
    await mintSomeTokens(
      program.provider,
      quoteMintKeypair.publicKey,
      quotePoolAtaOwner,
      10_000_000
    );
    setContext(`10 quote minted`);
    // get PDAs
    const [coveredCallBaseVault] = getCoveredCallBaseVaultPda(
      program.programId,
      underlyingMintKeypair.publicKey,
      quoteMintKeypair.publicKey
    );
    const [vaultLpMint] = getVaultLpMintPda(
      program.programId,
      coveredCallBaseVault
    );
    const [vaultMintAuthority] = getVaultMintAuthorityPda(
      program.programId,
      coveredCallBaseVault
    );
    // initialize the vault
    const ix = await program.methods
      .initialize()
      .accounts({
        payer: program.provider.publicKey,
        coveredCallBaseVault,
        vaultLpMint,
        vaultMintAuthority,
        authority: program.provider.publicKey,
        underlyingMint: underlyingMintKeypair.publicKey,
        underlyingPool: underlyingPoolAtaProgram,
        quoteMint: quoteMintKeypair.publicKey,
        premiumPool: quotePoolAtaProgram,
        poolAuthority,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .instruction();
    const vtx = await asV0Transaction(program.provider, [ix]);
    const sig = await program.provider.sendAndConfirm(vtx);
    console.log("sig", sig);
    setContext(`https://explorer.solana.com/tx/${sig}?cluster=devnet`);
    await getAndCreateAta(
      program.provider,
      vaultLpMint,
      program.provider.publicKey
    );
  } catch (error) {
    console.log("Error initializing tokens:", error);
  }
}

export async function depositIntoVault(
  program: Program<Vaults>,
  underlyingMintKeypair: anchor.web3.Keypair,
  quoteMintKeypair: anchor.web3.Keypair,
  setContext: (state: string) => void
) {
  setContext("Depositing into vault...");
  if (!program.provider.publicKey || !program.provider.sendAndConfirm) {
    throw new Error("Provider public key is undefined");
  }
  try {
    // get PDAs
    const [coveredCallBaseVault] = getCoveredCallBaseVaultPda(
      program.programId,
      underlyingMintKeypair.publicKey,
      quoteMintKeypair.publicKey
    );
    const [vaultLpMint] = getVaultLpMintPda(
      program.programId,
      coveredCallBaseVault
    );
    const [vaultMintAuthority] = getVaultMintAuthorityPda(
      program.programId,
      coveredCallBaseVault
    );
    const [poolAuthority] = getPoolAuthorityPda(program.programId);
    // get ATA for the owner of the vault
    const underlyingPoolAtaOwner = await getAssociatedTokenAddress(
      underlyingMintKeypair.publicKey,
      program.provider.publicKey,
      false
    );
    const quotePoolAtaOwner = await getAssociatedTokenAddress(
      quoteMintKeypair.publicKey,
      program.provider.publicKey,
      false
    );
    const vaultLpMintAtaOwner = await getAssociatedTokenAddress(
      vaultLpMint,
      program.provider.publicKey,
      false
    );
    // get ATA for the solana program
    const underlyingPoolAtaProgram = await getAssociatedTokenAddress(
      underlyingMintKeypair.publicKey,
      poolAuthority,
      true
    );
    const quotePoolAtaProgram = await getAssociatedTokenAddress(
      quoteMintKeypair.publicKey,
      poolAuthority,
      true
    );

    // deposit into the vault
    const ix = await program.methods
      .deposit(new anchor.BN(1_000_000), new anchor.BN(1_000_000))
      .accounts({
        payer: program.provider.publicKey,
        coveredCallBaseVault,
        vaultLpMint,
        vaultMintAuthority,
        payerVaultLpMintAta: vaultLpMintAtaOwner,
        authority: program.provider.publicKey,
        underlyingMint: underlyingMintKeypair.publicKey,
        underlyingPool: underlyingPoolAtaProgram,
        payerUnderlyingAta: underlyingPoolAtaOwner,
        quoteMint: quoteMintKeypair.publicKey,
        premiumPool: quotePoolAtaProgram,
        payerQuoteAta: quotePoolAtaOwner,
        poolAuthority,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .instruction();
    const vtx = await asV0Transaction(program.provider, [ix]);
    const sig = await program.provider.sendAndConfirm(vtx);
    if (sig) {
      setContext(`https://explorer.solana.com/tx/${sig}?cluster=devnet`);
    }
  } catch (error) {
    console.log("Error depositing into vault:", error);
  }
}
