// File: src/components/Keys.jsx
"use client";
import { useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import { mnemonicToSeed } from 'bip39';
import { Keypair } from '@solana/web3.js';
import nacl from 'tweetnacl';
import { HDNodeWallet, Wallet } from 'ethers';
import { derivePath } from 'ed25519-hd-key';

export default function Keys() {
  const location = useLocation();
  const { chain } = useParams();
  const [wallet, setWallet] = useState(null);

  const mnemonic = location.state?.mnemonic;

  useEffect(() => {
    async function generateKeys() {
      if (!mnemonic) return;

      const seed = await mnemonicToSeed(mnemonic);

      if (chain === 'solana') {
        const path = `m/44'/501'/0'/0'`;
        const derivedSeed = derivePath(path, seed.toString('hex')).key;
        const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
        const keypair = Keypair.fromSecretKey(secret);
        setWallet({
          publicKey: keypair.publicKey.toBase58(),
          privateKey: Buffer.from(secret).toString('hex'),
        });
      } else if (chain === 'ethereum') {
        const hd = HDNodeWallet.fromSeed(seed);
        const path = `m/44'/60'/0'/0/0`;
        const ethWallet = hd.derivePath(path);
        const privateKey = ethWallet.privateKey;
        const wallet = new Wallet(privateKey);
        setWallet({
          publicKey: wallet.address,
          privateKey,
        });
      }
    }

    generateKeys();
  }, [chain, mnemonic]);

  return (
    <div className="min-h-screen bg-black text-white font-sans px-6 py-12 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Wallet Keys</h1>

      {!wallet ? (
        <p className="text-gray-400">Generating wallet keys from your seed...</p>
      ) : (
        <div className="w-full max-w-3xl bg-white/5 p-6 rounded-lg shadow-lg space-y-6">
          <div>
            <p className="text-gray-400 text-sm mb-1">Public Key:</p>
            <p className="break-all font-mono bg-white/10 p-2 rounded">{wallet.publicKey}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Private Key:</p>
            <p className="break-all font-mono text-red-300 bg-white/10 p-2 rounded">{wallet.privateKey}</p>
          </div>

          <button className="mt-4 bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded-lg font-bold text-black">
            Add Wallet
          </button>
        </div>
      )}
    </div>
  );
}