import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import { getAccount, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import fs from "fs";
// Solana devnet endpoint
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// The public key of the wallet to fetch balances from
const sourcePublicKey = new PublicKey(
  "5kRot8UnMEqoDkAc72e7pqaEaF5hxGmbDNowMmPiCDmb"
);

// Load the source account keypair (the private key)
const KEYPAIR_PATH = `/home/hackerboy/.config/solana/id.json`;
const secretKey = JSON.parse(fs.readFileSync(KEYPAIR_PATH, "utf-8"));
const sourceKeypair = Keypair.fromSecretKey(new Uint8Array(secretKey));

// Function to get all token accounts for a given wallet
async function getTokenAccountsAndBalances(pubKey: PublicKey) {
  const tokenAccounts = await connection.getTokenAccountsByOwner(pubKey, {
    programId: TOKEN_PROGRAM_ID,
  });

  const balances = [];

  for (let account of tokenAccounts.value) {
    const accountInfo = await getAccount(
      connection,
      new PublicKey(account.pubkey)
    );
    balances.push({
      mint: accountInfo.mint.toBase58(),
      amount: accountInfo.amount,
      pubkey: account.pubkey.toBase58(),
    });
  }

  return balances;
}

// Main function to get all token balances and transfer them
async function main() {
  const balances = await getTokenAccountsAndBalances(sourcePublicKey);

  console.log(
    "Token balances:",
    balances.filter((b) => parseInt(String(b.amount)) > 0)
  );
}

// Execute the main function
(async () => {
  await main();
})();
