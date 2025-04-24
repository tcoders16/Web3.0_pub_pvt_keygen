// File: src/pages/Setup.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateMnemonic } from 'bip39';

export default function Setup() {
  const { chain } = useParams(); // Extract the chain type (solana or ethereum)
  const navigate = useNavigate();

  // Store the mnemonic phrase
  const [mnemonic, setMnemonic] = useState('');

  // Generate mnemonic on mount or regenerate
  const handleGenerateMnemonic = async () => {
    const phrase = await generateMnemonic();
    setMnemonic(phrase);
  };

  useEffect(() => {
    handleGenerateMnemonic();
  }, []);

  // Proceed to wallet screen with chain and mnemonic
  const handleContinue = () => {
    if (mnemonic) {
      navigate(`/wallet/${chain}`, { state: { mnemonic } });
    }
  };

  // Render the screen
  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center px-4 py-12">
      {/* Heading */}
      <h2 className="text-4xl font-orbitron font-bold text-center mb-6">
        Secret Recovery Phrase
      </h2>

      {/* Subtitle */}
      <p className="text-gray-400 mb-4 text-center">
        Save these words in a safe place. They can be used to recover your wallet.
      </p>

      {/* Seed display box */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 w-full max-w-3xl mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {mnemonic.trim().split(/\s+/).map((word, index) => (
            <div
              key={index}
              className="bg-white/10 text-white text-sm rounded-md px-4 py-2 text-center shadow-sm"
            >
              <span className="text-xs opacity-60 mr-1">{index + 1}.</span>{word}
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={handleGenerateMnemonic}
          className="bg-yellow-500 hover:bg-yellow-400 px-6 py-2 rounded-md text-black font-medium shadow-md"
        >
          Regenerate Phrase
        </button>
        <button
          onClick={handleContinue}
          className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-md text-white font-medium shadow-md"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
