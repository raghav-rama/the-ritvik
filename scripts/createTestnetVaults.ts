import { Vaults } from "@/types/leverageFunVaults";
import { Keypair, SystemProgram } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import {
  createInitializeMint2Instruction,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  MintLayout,
  TOKEN_PROGRAM_ID,
  createMintToInstruction,
  getMint,
} from "@solana/spl-token";
import fs from "fs";
import { getProgram } from "@/utils/getProgram";

const testnetTokenKeyairs: anchor.web3.Keypair[] = [];
const tokenKeypairsPaths = [
  "./scripts/testnetTokenKeypairs/ST1Rwanemw4ULxNxChAjaoq9WcSyWQMaCDUHTvsaUMj.json",
  "./scripts/testnetTokenKeypairs/T1ELwFd2QCTSmvvnLHQHJxjgz7DwesA6gJLb9NPSwjY.json",
  "./scripts/testnetTokenKeypairs/T2bB4xXTPLGWyniNVakbUfHNpzxeUVews3Jg5Et8gqP.json",
  "./scripts/testnetTokenKeypairs/T3UnbTxgwGniAi6yiJyyrn2xzS8L4FEYWg4cK9bvyFt.json",
  "./scripts/testnetTokenKeypairs/T4LX7z6yFMcjrRmcYVKczUV62aCHvKNpT7DRRj9Dfem.json",
];
for (const path of tokenKeypairsPaths) {
  const secretKey = JSON.parse(fs.readFileSync(path, "utf-8"));
  const keypair = anchor.web3.Keypair.fromSecretKey(new Uint8Array(secretKey));
  testnetTokenKeyairs.push(keypair);
}
const KEYPAIR_PATH = `/home/hackerboy/.config/solana/id.json`;
const secretKey = JSON.parse(fs.readFileSync(KEYPAIR_PATH, "utf-8"));
const payerKeypair = Keypair.fromSecretKey(new Uint8Array(secretKey));

async function main() {
  const provider = anchor.AnchorProvider.env();
  const program = await getProgram(provider);
  for (let i = 1; i < testnetTokenKeyairs.length; ++i) {
    await createVault(program, testnetTokenKeyairs[i], testnetTokenKeyairs[0]);
  }
}

main();
export async function createVault(
  program: Program<Vaults>,
  underlyingMintKeypair: anchor.web3.Keypair,
  quoteMintKeypair: anchor.web3.Keypair
) {
  if (!program.provider.publicKey) {
    throw new Error("Provider public key is undefined");
  }
  if (!program.provider.sendAndConfirm) {
    throw new Error("Provider sendAndConfirm is undefined");
  }
  let ataExists = false;
  try {
    // initialize underlying and quote tokens
    console.log("1");
    try {
      await getMint(
        program.provider.connection,
        underlyingMintKeypair.publicKey
      );
      ataExists = true;
      console.log("Underlying token mint already exists");
    } catch (error) {
      console.log("Creating underlying token mint");
      await createTokenMint(
        program.provider,
        underlyingMintKeypair,
        program.provider.publicKey,
        6
      );
    }

    console.log("2");
    try {
      await getMint(program.provider.connection, quoteMintKeypair.publicKey);
      ataExists = true;
      console.log("Quote token mint already exists");
    } catch (error) {
      console.log("Creating quote token mint");
      await createTokenMint(
        program.provider,
        quoteMintKeypair,
        program.provider.publicKey,
        6
      );
    }
    console.log("3");
    // initialize pools for the underlying and quote tokens
    // for the owner of the vault
    const { ataAddress: underlyingPoolAtaOwner } = await getAndCreateAta(
      program.provider,
      underlyingMintKeypair.publicKey,
      program.provider.publicKey
    );
    console.log("4");
    if (!ataExists) {
      const { ataAddress: quotePoolAtaOwner } = await getAndCreateAta(
        program.provider,
        quoteMintKeypair.publicKey,
        program.provider.publicKey
      );
    }
    console.log("5");
    // for the solana program
    const [poolAuthority] = getPoolAuthorityPda(program.programId);
    const { ataAddress: underlyingPoolAtaProgram } = await getAndCreateAta(
      program.provider,
      underlyingMintKeypair.publicKey,
      poolAuthority,
      true
    );
    console.log("6");
    let quotePoolAtaProgramG: PublicKey;
    if (!ataExists) {
      const { ataAddress: quotePoolAtaProgram } = await getAndCreateAta(
        program.provider,
        quoteMintKeypair.publicKey,
        poolAuthority,
        true
      );
      quotePoolAtaProgramG = quotePoolAtaProgram;
    } else {
      quotePoolAtaProgramG = await getAssociatedTokenAddress(
        quoteMintKeypair.publicKey,
        poolAuthority,
        true,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
    }
    console.log("7");
    // Mint some tokens
    // await mintSomeTokens(
    //   program.provider,
    //   underlyingMintKeypair.publicKey,
    //   underlyingPoolAtaOwner,
    //   10_000_000
    // );
    console.log("8");
    // await mintSomeTokens(
    //   program.provider,
    //   quoteMintKeypair.publicKey,
    //   quotePoolAtaOwner,
    //   10_000_000
    // );
    console.log("9");
    // get PDAs
    const [coveredCallBaseVault] = getCoveredCallBaseVaultPda(
      program.programId,
      underlyingMintKeypair.publicKey,
      quoteMintKeypair.publicKey
    );
    console.log("10");
    const [vaultLpMint] = getVaultLpMintPda(
      program.programId,
      coveredCallBaseVault
    );
    console.log("11");
    const [vaultMintAuthority] = getVaultMintAuthorityPda(
      program.programId,
      coveredCallBaseVault
    );
    console.log("12");
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
        premiumPool: quotePoolAtaProgramG,
        poolAuthority,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .instruction();
    const vtx = await asV0Transaction(program.provider, [ix]);
    const sig = await program.provider.sendAndConfirm(vtx);
    console.log("13", sig);

    await getAndCreateAta(
      program.provider,
      vaultLpMint,
      program.provider.publicKey
    );
    console.log("14");
  } catch (error) {
    console.log("Error initializing tokens:", error);
  }
}

export async function depositIntoVault(
  program: Program<Vaults>,
  underlyingMintKeypair: anchor.web3.Keypair,
  quoteMintKeypair: anchor.web3.Keypair
) {
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
    console.log("sig", sig);
  } catch (error) {
    console.log("Error depositing into vault:", error);
  }
}

export async function createTokenMint(
  provider: anchor.Provider,
  mintKeypair: anchor.web3.Keypair,
  mintAuthority: anchor.web3.PublicKey,
  decimals: number
): Promise<string> {
  if (!provider.publicKey || !provider.sendAndConfirm) {
    throw new Error("Provider public key is undefined");
  }
  let transactionInstructions: anchor.web3.TransactionInstruction[] = [];
  const mintRentBalance =
    await provider.connection.getMinimumBalanceForRentExemption(
      MintLayout.span
    );
  transactionInstructions.push(
    anchor.web3.SystemProgram.createAccount({
      fromPubkey: provider.publicKey,
      newAccountPubkey: mintKeypair.publicKey,
      space: MintLayout.span,
      lamports: mintRentBalance,
      programId: TOKEN_PROGRAM_ID,
    })
  );
  transactionInstructions.push(
    createInitializeMint2Instruction(
      mintKeypair.publicKey,
      decimals,
      mintAuthority,
      null,
      TOKEN_PROGRAM_ID
    )
  );
  const vtx = await asV0Transaction(provider, transactionInstructions);
  const sig = await provider.sendAndConfirm(vtx, [mintKeypair]);
  return sig;
}

export async function getAndCreateAta(
  provider: anchor.Provider,
  mint: anchor.web3.PublicKey,
  owner: anchor.web3.PublicKey,
  allowOwnerOffCurve: boolean = false
): Promise<Readonly<{ ataAddress: anchor.web3.PublicKey; sig: string }>> {
  if (!provider.publicKey || !provider.sendAndConfirm) {
    throw new Error("Provider public key is undefined");
  }
  const ataAddress = await getAssociatedTokenAddress(
    mint,
    owner,
    allowOwnerOffCurve,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  const instruction = createAssociatedTokenAccountInstruction(
    provider.publicKey,
    ataAddress,
    owner,
    mint,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  const vtx = await asV0Transaction(provider, [instruction]);
  const sig = await provider.sendAndConfirm(vtx);
  return { ataAddress, sig };
}

export async function getAndCreatePdaAta(
  provider: anchor.Provider,
  ataAddress: anchor.web3.PublicKey,
  mint: anchor.web3.PublicKey,
  owner: anchor.web3.PublicKey
): Promise<Readonly<{ ataAddress: anchor.web3.PublicKey; sig: string }>> {
  if (!provider.publicKey || !provider.sendAndConfirm) {
    throw new Error("Provider public key is undefined");
  }
  const instruction = createAssociatedTokenAccountInstruction(
    provider.publicKey,
    ataAddress,
    owner,
    mint,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  const vtx = await asV0Transaction(provider, [instruction]);
  const sig = await provider.sendAndConfirm(vtx);
  return { ataAddress, sig };
}

export async function mintSomeTokens(
  provider: anchor.Provider,
  mint: anchor.web3.PublicKey,
  destination: anchor.web3.PublicKey,
  amount: number
): Promise<string> {
  if (!provider.publicKey || !provider.sendAndConfirm) {
    throw new Error("Provider public key is undefined");
  }
  const instruction = createMintToInstruction(
    mint,
    destination,
    provider.publicKey,
    amount,
    [],
    TOKEN_PROGRAM_ID
  );
  const vtx = await asV0Transaction(provider, [instruction]);
  const sig = await provider.sendAndConfirm(vtx);
  return sig;
}

export async function asV0Transaction(
  provider: anchor.Provider,
  instructions: anchor.web3.TransactionInstruction[]
): Promise<anchor.web3.VersionedTransaction> {
  if (!provider.publicKey || !provider.sendAndConfirm) {
    throw new Error("Provider public key is undefined");
  }
  const messageV0 = new anchor.web3.TransactionMessage({
    payerKey: provider.publicKey,
    recentBlockhash: (await provider.connection.getLatestBlockhash()).blockhash,
    instructions,
  }).compileToV0Message();
  const vtx = new anchor.web3.VersionedTransaction(messageV0);
  return vtx;
}

export function getCoveredCallBaseVaultPda(
  programId: PublicKey,
  underlyingMint: PublicKey,
  quoteMint: PublicKey
) {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("covered_call_base_vault"),
      underlyingMint.toBuffer(),
      quoteMint.toBuffer(),
    ],
    programId
  );
}

export function getVaultLpMintPda(
  programId: PublicKey,
  coveredCallBaseVaultPda: PublicKey
) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("vault_lp_mint"), coveredCallBaseVaultPda.toBuffer()],
    programId
  );
}

export function getUnderlyingPoolPda(
  programId: PublicKey,
  underlyingMint: PublicKey
) {
  return PublicKey.findProgramAddressSync(
    [underlyingMint.toBuffer(), Buffer.from("underlying_pool")],
    programId
  );
}

export function getQuotePoolPda(programId: PublicKey, quoteMint: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [quoteMint.toBuffer(), Buffer.from("quote_pool")],
    programId
  );
}

export function getPoolAuthorityPda(programId: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("pool_authority")],
    programId
  );
}

export function getVaultMintAuthorityPda(
  programId: PublicKey,
  coveredCallBaseVaultPda: PublicKey
) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("vault_mint_authority"), coveredCallBaseVaultPda.toBuffer()],
    programId
  );
}
