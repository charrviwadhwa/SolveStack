// src/pages/LandingPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const topics = [
  "Binary Search", "Dynamic Programming", "Recursion", "Graphs", "Greedy", "Two Pointers",
  "Sliding Window", "Bit Manipulation", "Backtracking", "Stack & Queue", "Trie", "Segment Tree"
];

const generateStars = (count) => {
  const stars = [];
  for (let i = 0; i < count; i++) {
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    const size = Math.random() * 2 + 1;
    stars.push(
      <div
        key={"star" + i}
        className="absolute bg-white rounded-full animate-pulse"
        style={{
          top: `${top}%`,
          left: `${left}%`,
          width: `${size}px`,
          height: `${size}px`,
          opacity: Math.random() * 0.6 + 0.3,
        }}
      />
    );
  }
  return stars;
};

const generateShootingStars = (count) => {
  const stars = [];
  for (let i = 0; i < count; i++) {
    const top = Math.random() * 90;
    const delay = Math.random() * 20;
    const duration = 2 + Math.random() * 2;
    stars.push(
      <div
        key={"shooting" + i}
        className="absolute w-32 h-[2px] bg-white opacity-0"
        style={{
          top: `${top}%`,
          left: `-${Math.random() * 100}%`,
          animation: `shoot ${duration}s ease-in-out ${delay}s infinite`,
        }}
      />
    );
  }
  return stars;
};

const injectShootingStarCSS = () => {
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes shoot {
      0% { transform: translateX(0); opacity: 0; }
      10% { opacity: 1; }
      100% { transform: translateX(150vw); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [shootingStars, setShootingStars] = useState([]);

  useEffect(() => {
    injectShootingStarCSS();
    setShootingStars(generateShootingStars(6));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center overflow-hidden relative font-sans">
      {/* Galaxy Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900 via-black to-black opacity-90" />

      {/* Stars Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {generateStars(100)}
        {shootingStars}
      </div>

      {/* Glowing Hero Orb */}
      <div className="absolute top-[-200px] left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-purple-700 via-blue-500 to-purple-700 opacity-50 blur-3xl animate-pulse z-0" />

      {/* Hero Section */}
      <div className="relative z-10 text-center pt-36 px-6">
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold leading-tight mb-6"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Find your next <br /> DSA problem
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400">
            on your terms
          </span>
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          SolveStack helps you understand DSA questions with clear, structured explanations — so you focus on learning, not hunting.
        </motion.p>
        <motion.button
          onClick={() => navigate("/solve")}
          className="bg-white text-black font-semibold px-6 py-3 rounded-full shadow-xl hover:scale-105 transition"
          whileTap={{ scale: 0.95 }}
        >
          Paste a question →
        </motion.button>
      </div>

      {/* Scrolling Topics */}
      <div className="mt-16 w-full bg-black overflow-hidden border-t border-b border-gray-800 py-3">
        <motion.div
          className="flex gap-10 text-white text-lg font-semibold whitespace-nowrap"
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
        >
          {[...topics, ...topics].map((topic, i) => (
            <span key={i} className="px-4 text-gray-400 hover:text-white transition">
              {topic}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Problem Highlights */}
      <div className="mt-24 max-w-5xl px-6 text-center z-10">
        <h2 className="text-3xl font-bold mb-6">Why most students struggle with DSA</h2>
        <div className="grid md:grid-cols-3 gap-8 text-left text-gray-300">
          <div>
            <h3 className="text-red-400 font-bold mb-2">❌ Scattered Resources</h3>
            Too many tabs, too little clarity. Jumping from YouTube to blogs to forums just to understand one pattern.
          </div>
          <div>
            <h3 className="text-red-400 font-bold mb-2">❌ Inconsistent Learning</h3>
            You understand one problem today, but forget the approach tomorrow.
          </div>
          <div>
            <h3 className="text-red-400 font-bold mb-2">❌ Time Wasted</h3>
            Reading dozens of explanations to get one clear summary wastes your energy.
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-32 text-center px-6 z-10">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Meet <span className="text-purple-400">SolveStack</span> — your DSA sidekick
        </motion.h2>
        <motion.p
          className="text-gray-400 mb-6 max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Paste any DSA problem statement, and we’ll explain the concept, brute force approach, and optimal logic — all in plain English.
        </motion.p>
        <motion.button
          onClick={() => navigate("/solve")}
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Try Now →
        </motion.button>
      </div>

      {/* Footer */}
      <footer className="mt-32 mb-6 text-gray-500 text-sm z-10">
        Built with ❤️ by problem solvers, for problem solvers.
      </footer>
    </div>
  );
};

export default LandingPage;
