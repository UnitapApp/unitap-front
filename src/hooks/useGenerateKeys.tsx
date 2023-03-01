import { ethers } from 'ethers';
import { useState, useEffect } from 'react';

interface Keys {
  privateKey: string;
  publicKey: string;
}

const useGenerateKeys = (): [Keys | null, boolean, Error | null, () => Promise<string>] => {
  const [keys, setKeys] = useState<Keys | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const storedPrivateKey = localStorage.getItem('privateKey');
    const storedPublicKey = localStorage.getItem('publicKey');

    if (storedPrivateKey && storedPublicKey) {
      setKeys({ privateKey: storedPrivateKey, publicKey: storedPublicKey });
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

        // Store the keys in localStorage
        localStorage.setItem('privateKey', privateKey);
        localStorage.setItem('publicKey', publicKey);

        // Update the state with the keys
        setKeys({ privateKey, publicKey });
        setIsLoading(false);
      } catch (error: any) {
        setError(error);
        setIsLoading(false);
      }
    };

    generateKeys();

    
  }, []);

  const signPrivateKey = async (): Promise<string> => {
    if (!keys) {
      throw new Error('Private key not found');
    }

    const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/your-infura-project-id');
    const wallet = new ethers.Wallet(keys.privateKey, provider);

    return await wallet.signMessage(keys.publicKey);
  };

  return [keys, isLoading, error, signPrivateKey];
};

export default useGenerateKeys;