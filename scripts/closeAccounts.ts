import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  getAccount,
  closeAccount,
  TOKEN_PROGRAM_ID,
  createCloseAccountInstruction,
} from "@solana/spl-token";
import fs from "fs";

// Solana mainnet endpoint
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// The public key of the wallet to check
const sourcePublicKey = new PublicKey(
  "5kRot8UnMEqoDkAc72e7pqaEaF5hxGmbDNowMmPiCDmb"
);

// Load the source account keypair (the private key)

const KEYPAIR_PATH = `/home/hackerboy/.config/solana/id.json`;
const secretKey = JSON.parse(fs.readFileSync(KEYPAIR_PATH, "utf-8"));
const sourceKeypair = Keypair.fromSecretKey(new Uint8Array(secretKey));

// Function to get all token accounts for a given wallet
async function getTokenAccounts(pubKey: PublicKey) {
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

// Function to close a token account
async function closeTokenAccount(accountPubKey: PublicKey, owner: Keypair) {
  const transaction = new Transaction();

  // Close the token account and send any remaining SOL to the source wallet
  transaction.add(
    createCloseAccountInstruction(
      accountPubKey,
      sourcePublicKey,
      owner.publicKey
    )
  );

  // Send the transaction to the blockchain
  const signature = await sendAndConfirmTransaction(connection, transaction, [
    owner,
  ]);
  console.log(
    `Closed account ${accountPubKey.toBase58()} with signature: ${signature}`
  );
}

// Main function to find zero-balance accounts and close them
async function main() {
  try {
    // Step 1: Get all token accounts for the source account
    const tokenAccounts = await getTokenAccounts(sourcePublicKey);

    console.log("Token accounts:", tokenAccounts);

    // Step 2: Identify and close zero-balance token accounts
    for (let account of tokenAccounts) {
      if (parseInt(String(account.amount)) === 0) {
        console.log(`Closing zero-balance account: ${account.pubkey}`);
        const accountPubKey = new PublicKey(account.pubkey);

        // Perform the account closure
        await closeTokenAccount(accountPubKey, sourceKeypair);
      }
    }

    console.log("All zero-balance token accounts closed!");
  } catch (error) {
    console.error("Error closing token accounts:", error);
  }
}

// Execute the main function
main();
