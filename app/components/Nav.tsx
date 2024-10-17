"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import styles from "../styles/layout.module.scss";
import WalletMultiButton from "./WalletMultiButton";

export const Nav = () => {
  return (
    <div className={styles["theme-dark"]}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          <p>The Ritvik</p>
        </Link>
        {/* <Link href="/testnet">
          <button>Testnet</button>
        </Link> */}
        <WalletMultiButton
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        />
      </nav>
    </div>
  );
};
