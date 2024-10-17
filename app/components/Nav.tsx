"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import styles from "../styles/layout.module.scss";
import WalletMultiButton from "./WalletMultiButton";

import logo from "@/public/assets/R.svg";

export const Nav = () => {
  return (
    <div className={styles["theme-dark"]}>
      <nav className={styles.nav}>
        <Image src={logo} alt="the-ritvik" width={50} height={50} />
        <Link href="/" className={styles.logo}>
          <p>The Ritvik</p>
        </Link>
        <WalletMultiButton
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        />
      </nav>
    </div>
  );
};
