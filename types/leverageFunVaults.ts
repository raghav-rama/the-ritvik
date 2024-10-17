/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/vaults.json`.
 */
export type Vaults = {
  address: "doVLtcguouVHW5c6odaNrbcHAUEd2fkMGxq28efDptj";
  metadata: {
    name: "vaults";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "deposit";
      discriminator: [242, 35, 198, 137, 82, 225, 242, 182];
      accounts: [
        {
          name: "payer";
          writable: true;
          signer: true;
        },
        {
          name: "coveredCallBaseVault";
          writable: true;
        },
        {
          name: "vaultLpMint";
          writable: true;
        },
        {
          name: "vaultMintAuthority";
        },
        {
          name: "payerVaultLpMintAta";
          writable: true;
        },
        {
          name: "authority";
          writable: true;
        },
        {
          name: "underlyingMint";
          writable: true;
        },
        {
          name: "underlyingPool";
          docs: [
            "Deposit pool for the underlying asset",
            "Should be initialized before calling this instruction"
          ];
          writable: true;
        },
        {
          name: "payerUnderlyingAta";
          writable: true;
        },
        {
          name: "quoteMint";
          writable: true;
        },
        {
          name: "premiumPool";
          docs: [
            "Deposit pool for the quote asset",
            "Should be initialized before calling this instruction"
          ];
          writable: true;
        },
        {
          name: "payerQuoteAta";
          writable: true;
        },
        {
          name: "poolAuthority";
          docs: ["The general pool authority for the protocol"];
        },
        {
          name: "tokenProgram";
        },
        {
          name: "systemProgram";
        }
      ];
      args: [
        {
          name: "depositAmount";
          type: "u64";
        },
        {
          name: "premiumAmount";
          type: "u64";
        }
      ];
    },
    {
      name: "initialize";
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237];
      accounts: [
        {
          name: "payer";
          writable: true;
          signer: true;
        },
        {
          name: "coveredCallBaseVault";
          writable: true;
        },
        {
          name: "vaultLpMint";
          writable: true;
        },
        {
          name: "vaultMintAuthority";
        },
        {
          name: "authority";
          writable: true;
        },
        {
          name: "underlyingMint";
          writable: true;
        },
        {
          name: "underlyingPool";
          docs: [
            "Deposit pool for the underlying asset",
            "Should be initialized before calling this instruction"
          ];
          writable: true;
        },
        {
          name: "quoteMint";
          writable: true;
        },
        {
          name: "premiumPool";
          docs: [
            "Deposit pool for the quote asset",
            "Should be initialized before calling this instruction"
          ];
          writable: true;
        },
        {
          name: "poolAuthority";
          docs: ["The general pool authority for the protocol"];
        },
        {
          name: "tokenProgram";
        },
        {
          name: "systemProgram";
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: "coveredCallBaseVault";
      discriminator: [138, 80, 190, 45, 22, 116, 53, 30];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "vaultNotInitialized";
      msg: "The expiration is in the past";
    },
    {
      code: 6001;
      name: "depositAmountZero";
      msg: "The deposit amount is zero";
    },
    {
      code: 6002;
      name: "premiumZero";
      msg: "The premium amount is zero";
    },
    {
      code: 6003;
      name: "someError";
      msg: "";
    }
  ];
  types: [
    {
      name: "coveredCallBaseVault";
      serialization: "bytemuck";
      repr: {
        kind: "c";
      };
      type: {
        kind: "struct";
        fields: [
          {
            name: "totalDepositedAssets";
            docs: ["Total amount of underlying assets deposited in the vault"];
            type: "u64";
          },
          {
            name: "totalIssuedShares";
            docs: ["Total shares issued to depositors"];
            type: "u64";
          },
          {
            name: "currentOptionStrikePrice";
            docs: [
              "Current strike price of the options being sold (in smallest units, e.g., lamports)"
            ];
            type: "u64";
          },
          {
            name: "currentOptionExpiry";
            docs: [
              "Expiration timestamp of the current options (Unix timestamp)"
            ];
            type: "i64";
          },
          {
            name: "totalPremiumCollected";
            docs: ["Total option premiums collected (in smallest units)"];
            type: "u64";
          },
          {
            name: "transferWindow";
            type: "u64";
          },
          {
            name: "startTransferTime";
            docs: ["time at which withdrawals began"];
            type: "u64";
          },
          {
            name: "endTransferTime";
            docs: ["minimum time at which withdrawals end"];
            type: "u64";
          },
          {
            name: "isInitialized";
            docs: [
              "Indicates if the vault has been initialized, 0 - no, 1 - yes"
            ];
            type: "u8";
          },
          {
            name: "bumpSeed";
            docs: ["The bump seed for the vault"];
            type: "u8";
          },
          {
            name: "vaultLpMintBump";
            docs: ["The bump for vault lp mint"];
            type: "u8";
          },
          {
            name: "poolAuthorityBump";
            docs: ["The bump for pool authority"];
            type: "u8";
          },
          {
            name: "vaultMintAuthorityBump";
            docs: ["The bump for vault mint authority"];
            type: "u8";
          },
          {
            name: "padding";
            type: {
              array: ["u8", 3];
            };
          },
          {
            name: "manager";
            docs: ["The authority or manager of the vault"];
            type: "pubkey";
          },
          {
            name: "vaultLpMint";
            docs: ["The vault's LP token mint"];
            type: "pubkey";
          },
          {
            name: "underlyingMint";
            docs: ["The SPL token mint of the underlying asset"];
            type: "pubkey";
          },
          {
            name: "quoteMint";
            docs: [
              "The SPL token mint for the vault shares issued to depositors"
            ];
            type: "pubkey";
          },
          {
            name: "underlyingPool";
            docs: ["The SPL token account holding the underlying assets"];
            type: "pubkey";
          },
          {
            name: "optionMint";
            docs: ["The SPL token mint of the option token"];
            type: "pubkey";
          },
          {
            name: "premiumPool";
            docs: [
              "The SPL token account holding premiums collected from selling options"
            ];
            type: "pubkey";
          }
        ];
      };
    }
  ];
};
