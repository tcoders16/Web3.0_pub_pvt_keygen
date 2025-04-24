// File: src/pages/Home.jsx
"use client";
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  // Handler to navigate to setup page based on chain selected
  const handleSelect = (chain) => {
    navigate(`/setup/${chain}`);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center px-4 py-12">
      {/* Title */}
      <h1 className="text-4xl md:text-6xl font-bold font-orbitron text-center tracking-wide mb-6">
        Web Wallet Generator
      </h1>

      {/* Subtitle */}
      <p className="text-lg text-gray-400 text-center mb-10">
        Choose a blockchain to get started
      </p>

      {/* Buttons for blockchain selection */}
      <div className="flex space-x-6">
        <button
          onClick={() => handleSelect('solana')}
          className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg transition shadow-md hover:shadow-xl"
        >
          Solana
        </button>
        <button
          onClick={() => handleSelect('ethereum')}
          className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg transition shadow-md hover:shadow-xl"
        >
          Ethereum
        </button>
      </div>
    </div>
  );
}