import styles from "./DespositModal.module.scss";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectTheme, toggleTheme } from "@/lib/features/theme/themeSlice";
import { Keypair } from "@solana/web3.js";
import { Vaults as LeverageFunVaults } from "@/types/leverageFunVaults";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { depositIntoVault } from "./sdk";

export default function DepositModal({
  onClose,
  underlyingKeypair,
  quoteKeypair,
  program,
  setContext,
}: {
  onClose: () => void;
  underlyingKeypair: Keypair;
  quoteKeypair: Keypair;
  program: Program<LeverageFunVaults>;
  setContext: (state: string) => void;
}) {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);

  return (
    <>
      <div className={styles[theme]}>
        <div className={styles["modal-overlay"]}>
          <div className={styles["modal-content"]}>
            <button className={styles["close-button"]} onClick={onClose}>
              &times;
            </button>
            <h1>Deposit</h1>
            <div className={styles["input-container"]}>
              <input type="number" placeholder="Enter amount" />
            </div>
            <button
              onClick={async (e) => {
                onClose();
                await depositIntoVault(
                  program,
                  underlyingKeypair,
                  quoteKeypair,
                  setContext
                );
              }}
              className={styles["confirm-button"]}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
