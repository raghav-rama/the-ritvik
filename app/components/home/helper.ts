import * as anchor from "@coral-xyz/anchor";
import {
  createInitializeMint2Instruction,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  MintLayout,
  TOKEN_PROGRAM_ID,
  createMintToInstruction,
} from "@solana/spl-token";

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
