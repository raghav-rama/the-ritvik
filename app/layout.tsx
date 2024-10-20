import type { ReactNode } from "react";
import { StoreProvider } from "./StoreProvider";
import { WalletProvider } from "./components/WalletProvider";
import { Nav } from "./components/Nav";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { selectTheme, toggleTheme } from "@/lib/features/theme/themeSlice";

import "./styles/globals.scss";
import styles from "./styles/layout.module.scss";

interface Props {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <StoreProvider>
      <WalletProvider>
        <html lang="en">
          <head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link
              href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap"
              rel="stylesheet"
            />
          </head>
          <body>
            <section>
              <div className={styles.container}>
                <Nav />

                <main className={styles.main}>{children}</main>

                <footer className={styles.footer}>
                  Copyright © 2024 The Ritvik
                </footer>
              </div>
            </section>
            <div id="particles-js"></div>
            <script src="/assets/particles.min.js" />
            <script src="/assets/app.js" />
          </body>
        </html>
      </WalletProvider>
    </StoreProvider>
  );
}
