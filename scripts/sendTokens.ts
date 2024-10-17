import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  getAccount,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  transfer,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
} from "@solana/spl-token";
import fs from "fs";
// Solana devnet endpoint
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// The public key of the wallet to fetch balances from
const sourcePublicKey = new PublicKey(
  "5kRot8UnMEqoDkAc72e7pqaEaF5hxGmbDNowMmPiCDmb"
);

// The public key of the destination wallet (CTPc3YWh4w1UUTxXDuaHMGjhHV1KZAFGi8Drazf7ZUdf)
const destinationPublicKey = new PublicKey(
  "CTPc3YWh4w1UUTxXDuaHMGjhHV1KZAFGi8Drazf7ZUdf"
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

// Function to create a token transfer transaction
async function transferTokens(
  mint: PublicKey,
  from: PublicKey,
  to: PublicKey,
  owner: Keypair,
  amount: bigint
) {
  const transaction = new Transaction();

  // Get the source token account
  let sourceTokenAddress: PublicKey;
  try {
    sourceTokenAddress = await getAssociatedTokenAddress(
      mint,
      owner.publicKey,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
  } catch (err) {
    sourceTokenAddress = await getAssociatedTokenAddress(
      mint,
      owner.publicKey,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
  }

  // Check if the source token account exists and has sufficient balance
  try {
    const sourceAccount = await getAccount(connection, sourceTokenAddress);
    if (sourceAccount.amount < amount) {
      console.log(`Insufficient balance for token ${mint.toBase58()}`);
      return;
    }
  } catch (error) {
    console.log(
      `Error checking source account for token ${mint.toBase58()}:`,
      error
    );
    return;
  }

  // Get or create the associated token account for the destination
  let destinationTokenAddress: PublicKey;
  try {
    destinationTokenAddress = await getAssociatedTokenAddress(
      mint,
      to,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
  } catch (err) {
    console.log(
      `Error getting destination token address for ${mint.toBase58()}:`,
      err
    );
    return;
  }

  const accountExists = await connection.getAccountInfo(
    destinationTokenAddress
  );
  if (!accountExists) {
    // If the account doesn't exist, we need to create it
    transaction.add(
      createAssociatedTokenAccountInstruction(
        owner.publicKey,
        destinationTokenAddress,
        to,
        mint,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      )
    );
  }

  // Add the token transfer instruction
  transaction.add(
    createTransferInstruction(
      sourceTokenAddress,
      destinationTokenAddress,
      owner.publicKey,
      amount,
      [],
      TOKEN_PROGRAM_ID
    )
  );

  // Send the transaction
  try {
    const signature = await sendAndConfirmTransaction(connection, transaction, [
      owner,
    ]);
    console.log(`Transfer successful with signature: ${signature}`);
  } catch (error) {
    console.error(
      `Error sending transaction for token ${mint.toBase58()}:`,
      error
    );
    if (error instanceof Error && "logs" in error) {
      console.error("Transaction logs:", (error as any).logs);
    }
  }
}

// Main function to get all token balances and transfer them
async function main() {
  try {
    // Step 1: Get all token balances for the source account
    const balances = await getTokenAccountsAndBalances(sourcePublicKey);

    console.log(
      "Token balances:",
      balances.filter((b) => parseInt(String(b.amount)) > 0)
    );

    // Step 2: Transfer each token balance to the destination address
    for (let balance of balances) {
      const mint = new PublicKey(balance.mint);
      const sourceTokenAccount = new PublicKey(balance.pubkey);
      const amount = balance.amount;
      if (parseInt(String(amount)) == 0) {
        continue;
      }

      console.log(`Transferring ${amount} of token ${mint.toBase58()}`);

      // Perform the transfer
      await transferTokens(
        mint,
        sourceTokenAccount,
        destinationPublicKey,
        sourceKeypair,
        amount
      );

      // Add a small delay between transfers
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log("All tokens transferred successfully!");
  } catch (error) {
    console.error("Error transferring tokens:", error);
  }
}

// Execute the main function
(async () => {
  await main();
})();
