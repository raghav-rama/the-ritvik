import { PublicKey } from "@solana/web3.js";

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
