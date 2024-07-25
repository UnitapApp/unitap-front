"use client";

import { useCallback, useEffect, useState } from "react";
import { Address, createWalletClient, http } from "viem";
import { privateKeyToAccount, generatePrivateKey } from "viem/accounts";

interface Keys {
  privateKey: string;
  publicKey: string;
  address: string;
}

const getRandomBytes = (length: number): Uint8Array => {
  const randomBytesArray = new Uint8Array(length);
  window.crypto.getRandomValues(randomBytesArray);
  return randomBytesArray;
};

const useGenerateKeys = (): {
  keys: Keys | null;
  isLoading: boolean;
  error: Error | null;
  signPrivateKey: () => Promise<string>;
} => {
  const [keys, setKeys] = useState<Keys | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const generateKeys = async () => {
      try {
        setIsLoading(true);

        const privateKey = generatePrivateKey();

        const wallet = createWalletClient({
          transport: http(
            "https://mainnet.infura.io/v3/709c5809e1864f82ab6175f39d1aa0ba",
          ),
          account: privateKeyToAccount(privateKey),
        });

        const publicKey = wallet.account.publicKey;
        const address = wallet.account.address;

        setKeys({ privateKey, publicKey, address });
        setIsLoading(false);
      } catch (error: any) {
        console.log(error);
        setError(error);
        setIsLoading(false);
      }
    };

    generateKeys();
  }, []);

  const signPrivateKey = useCallback(async () => {
    if (!keys || !keys.address || !keys.privateKey) {
      throw new Error("Private key not found");
    }

    const wallet = createWalletClient({
      transport: http(
        "https://mainnet.infura.io/v3/709c5809e1864f82ab6175f39d1aa0ba",
      ),
      account: privateKeyToAccount(keys.privateKey as Address),
    });

    return await wallet.signMessage({
      message: keys.address,
    });
  }, [keys]);

  return { keys, isLoading, error, signPrivateKey };
};

export default useGenerateKeys;
