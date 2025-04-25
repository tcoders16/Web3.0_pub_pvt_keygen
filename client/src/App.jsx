// File: src/App.jsx
"use client";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Setup from './components/Setup';
import Wallet from './components/Wallet';
import Key from './components/Key';

import Footer from './components/Footer';


export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/setup/:chain" element={<Setup />} />
          <Route path="/wallet/:chain" element={<Wallet />} />
          <Route path="/key/:chain" element={<Key />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}
