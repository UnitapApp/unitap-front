import { ethers } from 'ethers';
import { useCallback, useEffect, useState } from 'react';

interface Keys {
  privateKey: string;
  publicKey: string;
  address: string;
}

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
    const storedPrivateKey = localStorage.getItem('privateKey');
    const storedPublicKey = localStorage.getItem('publicKey');
    const storedAddress = localStorage.getItem('address');

    if (storedPrivateKey && storedPublicKey && storedAddress) {
      setKeys({ privateKey: storedPrivateKey, publicKey: storedPublicKey, address: storedAddress });
      return;
    }

    const generateKeys = async () => {
      try {
        setIsLoading(true);

        // Generate a random private key
        const privateKey = ethers.utils.hexlify(ethers.utils.randomBytes(32));

        // Derive the public key from the private key
        const wallet = new ethers.Wallet(privateKey);
        const publicKey = wallet.publicKey;
        const address = wallet.address;

        // Store the keys in localStorage
        localStorage.setItem('privateKey', privateKey);
        localStorage.setItem('publicKey', publicKey);
        localStorage.setItem('address', address);

        // Update the state with the keys
        setKeys({ privateKey, publicKey, address });
        setIsLoading(false);
      } catch (error: any) {
        setError(error);
        setIsLoading(false);
      }
    };

    generateKeys();
  }, []);

  const signPrivateKey = useCallback(async () => {
    if (!keys || !keys.address || !keys.privateKey) {
      throw new Error('Private key not found');
    }

    const provider = new ethers.providers.JsonRpcProvider(
      'https://mainnet.infura.io/v3/709c5809e1864f82ab6175f39d1aa0ba',
    );
    const wallet = new ethers.Wallet(keys.privateKey, provider);

    return await wallet.signMessage(keys.address);
  }, [keys]);

  return { keys, isLoading, error, signPrivateKey };
};

export default useGenerateKeys;
