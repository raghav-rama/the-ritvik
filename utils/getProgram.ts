import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { Vaults as LeverageFunVaults } from "types/leverageFunVaults";

export async function getProgram(
  provider: anchor.Provider
): Promise<anchor.Program<LeverageFunVaults>> {
  try {
    const pid = new PublicKey("doVLtcguouVHW5c6odaNrbcHAUEd2fkMGxq28efDptj");
    const idl = (await anchor.Program.fetchIdl<LeverageFunVaults>(
      pid,
      provider
    ))!;
    const program = new anchor.Program<LeverageFunVaults>(idl, provider);
    return program;
  } catch (e) {
    throw new Error("Failed to load demo program. Was it deployed?");
  }
}
