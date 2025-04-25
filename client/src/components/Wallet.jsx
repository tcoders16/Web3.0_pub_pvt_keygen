// Updated Wallet.jsx with Neon Style Buttons (Violet, Orange, Pink, Blue)
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
  const [mnemonic, setMnemonic] = useState(location.state?.mnemonic || "");
  const [wallets, setWallets] = useState([]);
  const [showPrivateKeys, setShowPrivateKeys] = useState({});
  const [showAllPrivateKeys, setShowAllPrivateKeys] = useState(false);

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
      setWallet({
        publicKey: ethWallet.address,
        privateKey: ethWallet.privateKey,
      });
    }
  };

  useEffect(() => { handleGenerateWallet(); }, [mnemonic]);

  const handleAddWallet = () => {
    if (wallet) {
      setWallets([...wallets, wallet]);
      setShowPrivateKeys({ ...showPrivateKeys, [wallets.length]: false });
    }
  };

  const handleClearAll = () => {
    setWallets([]);
    setShowPrivateKeys({});
  };

  const handleDeleteWallet = (index) => {
    const updated = wallets.filter((_, i) => i !== index);
    setWallets(updated);
    const visibility = { ...showPrivateKeys };
    delete visibility[index];
    setShowPrivateKeys(visibility);
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
    setWallet(null);
  };

  return (
    <div className="min-h-screen bg-black text-white font-black -sans px-6 py-12 flex flex-col items-center">
      <h1 className="text-3xl -mono mb-6">Wallet</h1>

      <button
            onClick={handleRegenerateMnemonic}
            className="bg-[#00FFFF] text-black -mono px-6 py-3 rounded-lg 
                        shadow-[0_0_20px_#00FFFF] hover:shadow-[0_0_40px_#00FFFF] 
                        transition duration-300 mb-8"
            >
            Regenerate Mnemonic Phrase
            </button>

      {mnemonic && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 w-full max-w-3xl mb-6">
          <h3 className="text-lg -mono mb-4">Mnemonic Phrase</h3>
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

      {wallet && (
        <div className="w-full max-w-3xl bg-white/5 p-6 rounded-lg shadow-lg space-y-6">
          <div>
            <p className="text-gray-400 text-sm mb-1">Public Key:</p>
            <p className="break-all -mono bg-white/10 p-2 rounded">{wallet.publicKey}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Private Key:</p>
            <p className="break-all -mono text-pink-300 bg-white/10 p-2 rounded">
              {showPrivateKeys[wallets.length] ? wallet.privateKey : "**********"}
            </p>
            <button
              onClick={() => togglePrivateKeyVisibility(wallets.length)}
              className="text-sm text-blue-400 hover:underline"
            >
              {showPrivateKeys[wallets.length] ? "Hide" : "Show"} Private Key
            </button>
          </div>

          <button
            onClick={handleAddWallet}
            className="bg-[#FF00FF] text-white -mono px-6 py-2 rounded-lg shadow-[0_0_15px_#FF00FF] hover:shadow-[0_0_30px_#FF00FF]"
          >
            Add Wallet
          </button>
        </div>
      )}

      {wallets.length > 0 && (
        <div className="w-full max-w-3xl mt-8 space-y-6">
          <h2 className="text-2xl -mono mb-4">Added Wallets</h2>
          <button
            onClick={toggleAllPrivateKeys}
            className="bg-[#00FFFF] text-black -mono px-6 py-2 rounded-lg shadow-[0_0_15px_#00FFFF] hover:shadow-[0_0_30px_#00FFFF]"
          >
            {showAllPrivateKeys ? "Hide All Private Keys" : "Show All Private Keys"}
          </button>

          {wallets.map((w, index) => (
            <div key={index} className="bg-white/5 p-4 rounded-lg shadow-md">
              <p className="text-gray-400 text-sm">Public Key:</p>
              <p className="break-all -mono bg-white/10 p-2 rounded">{w.publicKey}</p>
              <p className="text-gray-400 text-sm mt-2">Private Key:</p>
              <input
                type={showAllPrivateKeys || showPrivateKeys[index] ? "text" : "password"}
                value={w.privateKey}
                readOnly
                className="break-all -mono text-pink-300 bg-white/10 p-2 rounded w-full"
              />
              <button
                onClick={() => togglePrivateKeyVisibility(index)}
                className="text-sm -mono text-blue-400 hover:underline"
              >
                {showPrivateKeys[index] ? "Hide" : "Show"} Private Key
              </button> <br/><br/>
              <button
                    onClick={() => handleDeleteWallet(index)}
                    className="mt-2 bg-[#FF4500] text-white -mono px-4 py-2 rounded-lg 
                                shadow-[0_0_15px_#FF4500] hover:shadow-[0_0_30px_#FF6347] 
                                transition duration-300"
                    >
                    Delete Wallet
                    </button>
            </div>
          ))}

            <button
            onClick={handleClearAll}
            className="mt-6 bg-[#8080FF] text-white -mono px-6 py-2 rounded-lg 
                        shadow-[0_0_15px_#8080FF] hover:shadow-[0_0_30px_#9999FF] 
                        transition duration-300"
            >
            Clear All Wallets
            </button> <br/><br/><br/><br/><br/>
        </div>
      )}
    </div>
  );
}