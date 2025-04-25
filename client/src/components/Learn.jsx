// File: src/components/Learn.jsx

import React, { useState } from 'react';

const CodeBlock = ({ title, code }) => {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  return (
    <div className="bg-[#111418] border font-bold border-neutral-700 shadow-lg rounded-xl p-5 text-left relative overflow-hidden group">
      <div className="text-xs text-blue-400 tracking-wide uppercase mb-2 -medium">
        {title}
      </div>
      <pre className="bg-black/30 p-4 rounded-md text-green-400 text-sm overflow-x-auto -mono">
        {code}
      </pre>
      <button
        onClick={copyCode}
        className="absolute top-3 right-3 px-3 py-1 text-xs -bold text-white bg-black/50 border border-green-400 rounded-lg transition-all duration-300 ease-in-out group-hover:border-lime-400 animate-pulse hover:shadow-[0_0_12px_#00ff90]"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};

const Learn = () => {
    return (
        <div className="min-h-screen font-semibold bg-gradient-to-br from-[#0d0d0d] via-[#121212] to-[#0d0d0d] text-gray-100 px-6 py-12">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-center text-4xl font-bold mb-10 text-yellow-300 tracking-tight">
              Web-Based Wallet Generator
            </h1>
      
            {/* Overview */}
            <section className="mb-10 text-center text-gray-300 text-base">
              <p className="mb-4">
                Build HD wallets in-browser using Web3 cryptography. This app uses BIP-39 mnemonics to generate seed phrases and derive public/private key pairs
                for both Ethereum and Solana using client-side secure cryptographic operations.
              </p>
            </section>
      
            {/* Features */}
            <section className="mb-10">
                    <h2 className="text-2xl text-yellow-300 font-semibold mb-3">What This Project Does</h2>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                        <li>
                        Generate <code className="bg-gray-800 text-green-400 px-1 rounded">BIP-39</code> mnemonic phrases
                        </li>
                        <li>
                        Derive Solana keys with <code className="bg-gray-800 text-pink-400 px-1 rounded">ed25519</code>
                        </li>
                        <li>
                        Derive Ethereum wallet using <code className="bg-gray-800 text-blue-400 px-1 rounded">secp256k1</code>
                        </li>
                        <li>
                        Toggle <code className="bg-gray-800 text-red-400 px-1 rounded">private key</code> visibility securely
                        </li>
                        <li>
                        <code className="bg-gray-800 text-yellow-400 px-1 rounded">Reset</code>, <code className="bg-gray-800 text-yellow-400 px-1 rounded">clear</code>, or <code className="bg-gray-800 text-yellow-400 px-1 rounded">add</code> multiple wallets
                        </li>
                    </ul>
                    </section>
      
            {/* Tech Stack */}
            <section className="mb-10">
              <h2 className="text-2xl text-yellow-300 font-semibold mb-3">Technologies Used</h2>
              <p className="text-sm text-gray-400 flex flex-wrap gap-2">
                <code className="bg-gray-800 text-green-400 px-2 py-1 rounded-md text-xs">React</code>
                <code className="bg-gray-800 text-blue-400 px-2 py-1 rounded-md text-xs">Tailwind CSS</code>
                <code className="bg-gray-800 text-yellow-400 px-2 py-1 rounded-md text-xs">bip39</code>
                <code className="bg-gray-800 text-pink-400 px-2 py-1 rounded-md text-xs">tweetnacl</code>
                <code className="bg-gray-800 text-cyan-400 px-2 py-1 rounded-md text-xs">@solana/web3.js</code>
                <code className="bg-gray-800 text-purple-400 px-2 py-1 rounded-md text-xs">ethers.js</code>
                <code className="bg-gray-800 text-red-400 px-2 py-1 rounded-md text-xs">ed25519-hd-key</code>
                </p>
            </section>
      
            {/* Key Generation Code */}
            <section className="mb-10">
              <h2 className="text-2xl text-yellow-300 font-semibold mb-6">Key Generation Logic</h2>
      
              <CodeBlock
                title="1. Generate Mnemonic"
                code={`import { generateMnemonic } from 'bip39';\nconst mnemonic = generateMnemonic();`}
              />
      
              <CodeBlock
                title="2. Convert Mnemonic to Seed"
                code={`import { mnemonicToSeed } from 'bip39';\nconst seed = await mnemonicToSeed(mnemonic);`}
              />
      
              <CodeBlock
                title="3. Derive Solana Keypair (ed25519)"
                code={`import nacl from 'tweetnacl';\nimport { derivePath } from 'ed25519-hd-key';\nimport { Keypair } from '@solana/web3.js';\n\nconst path = \`m/44'/501'/0'/0'\`;\nconst derivedSeed = derivePath(path, seed.toString('hex')).key;\nconst secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;\nconst solanaKeypair = Keypair.fromSecretKey(secret);`}
              />
      
              <CodeBlock
                title="4. Derive Ethereum Wallet (secp256k1)"
                code={`import { HDNodeWallet, Wallet as EthWallet } from 'ethers';\n\nconst hd = HDNodeWallet.fromSeed(seed);\nconst path = \`m/44'/60'/0'/0/0\`;\nconst ethWallet = hd.derivePath(path);\nconst publicKey = ethWallet.address;\nconst privateKey = ethWallet.privateKey;`}
              />
            </section>
      
            {/* Tutorial Steps */}
            <section className="mb-10">
              <h2 className="text-2xl text-yellow-300 font-semibold mb-3">Tutorial Steps</h2>
              <ul className="list-decimal list-inside space-y-1 text-sm text-gray-300">
                <li>Select blockchain (Solana or Ethereum)</li>
                <li>Generate a mnemonic phrase (12-word seed)</li>
                <li>View your recovery phrase and copy if needed</li>
                <li>Click continue to derive and display wallet keys</li>
                <li>Use "Add Wallet" to save and manage multiple wallets</li>
                <li>Toggle visibility for private keys securely</li>
                <li>Clear or regenerate as needed to reset the flow</li>
              </ul>
            </section>
      
            {/* Learning Outcomes */}
            <section>
  <h2 className="text-2xl text-yellow-300 font-semibold mb-2">Key Learnings</h2>
  <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
    <li>Client-side HD wallet generation using <code className="bg-gray-800 text-green-400 px-1 rounded">BIP-39</code> & <code className="bg-gray-800 text-green-400 px-1 rounded">BIP-32</code></li>
    <li>Deriving asymmetric key pairs with <code className="bg-gray-800 text-green-400 px-1 rounded">ed25519</code> & <code className="bg-gray-800 text-green-400 px-1 rounded">secp256k1</code></li>
    <li>Understanding path derivation logic (<code className="bg-gray-800 text-blue-400 px-1 rounded">m/44'/<span className="text-yellow-300">coin_type</span>'/...</code>)</li>
    <li>Secure UX for handling and revealing <code className="bg-gray-800 text-red-400 px-1 rounded">private keys</code></li>
    <li><code className="bg-gray-800 text-indigo-400 px-1 rounded">React</code> + <code className="bg-gray-800 text-pink-400 px-1 rounded">Tailwind</code> for professional Web3 interfaces</li>
  </ul>
</section>
          </div>
          <br/><br/><br/>
        </div>
      );
};

export default Learn;
