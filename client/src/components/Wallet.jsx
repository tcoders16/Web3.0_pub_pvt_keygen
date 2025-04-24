"use client";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Buffer } from "buffer";
import { mnemonicToSeed, generateMnemonic } from "bip39";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import { HDNodeWallet, Wallet as EthWallet } from "ethers";
import { derivePath } from "ed25519-hd-key";

export default function Wallet() {
  const location = useLocation();
  const { chain } = useParams();
  const [wallet, setWallet] = useState(null);
  const [mnemonic, setMnemonic] = useState(location.state?.mnemonic || ""); // Use mnemonic from Setup page or default
  const [wallets, setWallets] = useState([]); // State to store multiple wallets
  const [showPrivateKeys, setShowPrivateKeys] = useState({}); // State to toggle private key visibility
  const [showAllPrivateKeys, setShowAllPrivateKeys] = useState(false); // State to toggle all private keys

  // Generate wallet keys based on the mnemonic
  const handleGenerateWallet = async () => {
    if (!mnemonic) return;

    const seed = await mnemonicToSeed(mnemonic);

    if (chain === "solana") {
      const path = `m/44'/501'/0'/0'`;
      const derivedSeed = derivePath(path, seed.toString("hex")).key;
      const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
      const keypair = Keypair.fromSecretKey(secret);
      setWallet({
        publicKey: keypair.publicKey.toBase58(),
        privateKey: Buffer.from(secret).toString("hex"),
      });
    } else if (chain === "ethereum") {
      const hd = HDNodeWallet.fromSeed(seed);
      const path = `m/44'/60'/0'/0/0`;
      const ethWallet = hd.derivePath(path);
      const privateKey = ethWallet.privateKey;
      const wallet = new EthWallet(privateKey);
      setWallet({
        publicKey: wallet.address,
        privateKey,
      });
    }
  };

  useEffect(() => {
    handleGenerateWallet(); // Generate wallet on mount using the default mnemonic
  }, [mnemonic]);

  const handleAddWallet = () => {
    if (wallet) {
      setWallets([...wallets, wallet]); // Add the current wallet to the list
      setShowPrivateKeys({ ...showPrivateKeys, [wallets.length]: false }); // Default private key visibility to hidden
    }
  };

  const handleClearAll = () => {
    setWallets([]); // Clear all wallets
    setShowPrivateKeys({}); // Reset private key visibility
  };

  const handleDeleteWallet = (index) => {
    const updatedWallets = wallets.filter((_, i) => i !== index); // Remove wallet at the specified index
    setWallets(updatedWallets);

    // Update private key visibility state
    const updatedVisibility = { ...showPrivateKeys };
    delete updatedVisibility[index];
    setShowPrivateKeys(updatedVisibility);
  };

  const togglePrivateKeyVisibility = (index) => {
    setShowPrivateKeys({
      ...showPrivateKeys,
      [index]: !showPrivateKeys[index],
    });
  };

  const toggleAllPrivateKeys = () => {
    setShowAllPrivateKeys(!showAllPrivateKeys);
  };

  const handleRegenerateMnemonic = async () => {
    const newMnemonic = await generateMnemonic();
    setMnemonic(newMnemonic);
    setWallet(null); // Reset wallet when regenerating the phrase
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans px-6 py-12 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Wallet</h1>

      {/* Regenerate Mnemonic Phrase */}
      <div className="mb-6">
        <button
          onClick={handleRegenerateMnemonic}
          className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg font-bold text-white"
        >
          Regenerate Mnemonic Phrase
        </button>
      </div>

      {/* Display Mnemonic */}
      {mnemonic && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 w-full max-w-3xl mb-6">
          <h3 className="text-lg font-bold mb-4">Mnemonic Phrase</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {mnemonic.trim().split(/\s+/).map((word, index) => (
              <div
                key={index}
                className="bg-white/10 text-white text-sm rounded-md px-4 py-2 text-center shadow-sm"
              >
                <span className="text-xs opacity-60 mr-1">{index + 1}.</span>
                {word}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Display Wallet */}
      {wallet ? (
        <div className="w-full max-w-3xl bg-white/5 p-6 rounded-lg shadow-lg space-y-6">
          <div>
            <p className="text-gray-400 text-sm mb-1">Public Key:</p>
            <p className="break-all font-mono bg-white/10 p-2 rounded">
              {wallet.publicKey}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Private Key:</p>
            <p className="break-all font-mono text-red-300 bg-white/10 p-2 rounded">
              {showPrivateKeys[wallets.length]
                ? wallet.privateKey
                : "**********"}
            </p>
            <button
              onClick={() => togglePrivateKeyVisibility(wallets.length)}
              className="text-sm text-blue-400 hover:underline mt-1"
            >
              {showPrivateKeys[wallets.length] ? "Hide" : "Show"} Private Key
            </button>
          </div>

          <button
            onClick={handleAddWallet} // Add wallet on button click
            className="mt-4 bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded-lg font-bold text-black"
          >
            Add Wallet
          </button>
        </div>
      ) : (
        <p className="text-gray-400">Generating wallet keys...</p>
      )}

      {/* Display Added Wallets */}
      {wallets.length > 0 && (
        <div className="w-full max-w-3xl mt-8 space-y-6">
          <h2 className="text-2xl font-bold mb-4">Added Wallets</h2>
          <button
            onClick={toggleAllPrivateKeys}
            className="mb-4 bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg font-bold text-white"
          >
            {showAllPrivateKeys ? "Hide All Private Keys" : "Show All Private Keys"}
          </button>
          {wallets.map((w, index) => (
            <div
              key={index}
              className="bg-white/5 p-4 rounded-lg shadow-md space-y-2"
            >
              <div>
                <p className="text-gray-400 text-sm mb-1">Public Key:</p>
                <p className="break-all font-mono bg-white/10 p-2 rounded">
                  {w.publicKey}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Private Key:</p>
                <input
                  type={showAllPrivateKeys || showPrivateKeys[index] ? "text" : "password"}
                  value={w.privateKey}
                  readOnly
                  className="break-all font-mono text-red-300 bg-white/10 p-2 rounded w-full"
                />
                <button
                  onClick={() => togglePrivateKeyVisibility(index)}
                  className="text-sm text-blue-400 hover:underline mt-1"
                >
                  {showPrivateKeys[index] ? "Hide" : "Show"} Private Key
                </button>
              </div>
              <button
                onClick={() => handleDeleteWallet(index)} // Delete specific wallet
                className="mt-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-bold text-white"
              >
                Delete Wallet
              </button>
            </div>
          ))}
          <button
            onClick={handleClearAll} // Clear all wallets
            className="mt-6 bg-gray-500 hover:bg-gray-600 px-6 py-2 rounded-lg font-bold text-white"
          >
            Clear All Wallets
          </button>
        </div>
      )}
    </div>
  );
}