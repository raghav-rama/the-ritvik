import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Testnet | Leverage.fun",
  description: "Testnet Tokens",
  icons: {
    icon: "/assets/favicon.ico",
  },
};

interface PropsWithChildren {
  readonly children: ReactNode;
}

export default function TestnetLayout({ children }: PropsWithChildren) {
  return (
    <>
      <div>{children}</div>
    </>
  );
}
