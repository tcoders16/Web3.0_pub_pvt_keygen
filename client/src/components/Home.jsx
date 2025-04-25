// File: src/pages/Home.jsx
"use client";
import React from 'react';
import "../App.css"
import "../index.css";
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  // Handler to navigate to setup page based on chain selected
  const handleSelect = (chain) => {
    navigate(`/setup/${chain}`);
  };

  return (
    <div className="min-h-screen   bg-black text-white  flex flex-col items-center justify-center px-4 py-12">
      {/* Title */}
      <h1 className="text-4xl md:text-6xl   text-center tracking-wide mb-6">
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
          className="bg-[#CFFF04] text-black  py-3 px-6 rounded-lg shadow-[0_0_20px_#CFFF04] hover:shadow-[0_0_40px_#CFFF04] transition duration-300"
        >
          Solana
        </button>
        <button
          onClick={() => handleSelect('ethereum')}
          className="bg-[#CFFF04] text-black py-3 px-6 rounded-lg shadow-[0_0_20px_#CFFF04] hover:shadow-[0_0_40px_#CFFF04] transition duration-300"
        >
          Ethereum
        </button>
      </div>
    </div>
  );
}