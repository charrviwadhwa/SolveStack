// src/pages/LandingPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const topics = [
  "Binary Search", "Dynamic Programming", "Recursion", "Graphs", "Greedy", "Two Pointers",
  "Sliding Window", "Bit Manipulation", "Backtracking", "Stack & Queue", "Trie", "Segment Tree"
];

// Utility: Random start point for shooting star
const getRandomStartPoint = () => {
  const side = Math.floor(Math.random() * 4);
  const offset = Math.random() * window.innerWidth;
  switch (side) {
    case 0: return { x: offset, y: 0, angle: 45 };
    case 1: return { x: window.innerWidth, y: offset, angle: 135 };
    case 2: return { x: offset, y: window.innerHeight, angle: 225 };
    case 3: return { x: 0, y: offset, angle: 315 };
    default: return { x: 0, y: 0, angle: 45 };
  }
};

const ShootingStars = ({
  minSpeed = 10,
  maxSpeed = 30,
  minDelay = 1200,
  maxDelay = 4200,
  starColor = "#9E00FF",
  trailColor = "#2EB9DF",
  starWidth = 10,
  starHeight = 1,
  className = "",
}) => {
  const [stars, setStars] = useState([]);
  const starsRef = useRef([]);

  useEffect(() => {
    let isMounted = true;

    const createStar = () => {
      if (!isMounted) return;
      const { x, y, angle } = getRandomStartPoint();
      const star = {
        id: Date.now() + Math.random(),
        x,
        y,
        angle,
        speed: Math.random() * (maxSpeed - minSpeed) + minSpeed,
        distance: 0,
        scale: 1,
      };
      starsRef.current.push(star);
      const delay = Math.random() * (maxDelay - minDelay) + minDelay;
      setTimeout(createStar, delay);
    };

    createStar();

    const animate = () => {
      starsRef.current = starsRef.current
        .map((star) => {
          const dx = star.speed * Math.cos((star.angle * Math.PI) / 180);
          const dy = star.speed * Math.sin((star.angle * Math.PI) / 180);
          const newX = star.x + dx;
          const newY = star.y + dy;
          const newDistance = star.distance + star.speed;
          const newScale = 1 + newDistance / 100;

          if (
            newX < -100 || newX > window.innerWidth + 100 ||
            newY < -100 || newY > window.innerHeight + 100
          ) return null;

          return { ...star, x: newX, y: newY, distance: newDistance, scale: newScale };
        })
        .filter(Boolean);

      setStars([...starsRef.current]);
      requestAnimationFrame(animate);
    };

    animate();
    return () => { isMounted = false; };
  }, [minSpeed, maxSpeed, minDelay, maxDelay]);

  return (
    <svg className={`absolute inset-0 w-full h-full ${className}`}>
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={trailColor} stopOpacity="0" />
          <stop offset="100%" stopColor={starColor} stopOpacity="1" />
        </linearGradient>
      </defs>
      {stars.map((star) => (
        <rect
          key={star.id}
          x={star.x}
          y={star.y}
          width={starWidth * star.scale}
          height={starHeight}
          fill="url(#gradient)"
          transform={`rotate(${star.angle}, ${star.x + (starWidth * star.scale) / 2}, ${star.y + starHeight / 2})`}
        />
      ))}
    </svg>
  );
};

const generateStars = (count) => {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push(
      <div
        key={i}
        className="absolute bg-white rounded-full animate-pulse"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          width: `${Math.random() * 2 + 1}px`,
          height: `${Math.random() * 2 + 1}px`,
          opacity: Math.random() * 0.5 + 0.3,
        }}
      />
    );
  }
  return stars;
};

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center overflow-hidden relative font-sans">
      {/* Galaxy Gradient Background */}
      <div className="absolute top-6 left-6 z-50 flex items-center gap-2">
  <img src="/logo2.png" alt="SolveStack Logo" className="h-10 w-10 " />
  <span className="text-white text-xl font-extrabold leading-none">SolveStack</span>
</div>
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900 via-black to-black opacity-90" />

      {/* Static Stars */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {generateStars(100)}
        <ShootingStars />
      </div>

      {/* Hero Glow */}
      <div className="absolute top-[-200px] left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-purple-700 via-blue-500 to-purple-700 opacity-50 blur-3xl animate-pulse z-0" />

      {/* Hero Content */}
      <div className="relative z-10 text-center pt-26 px-6">
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

      {/* Scrolling DSA Topics */}
    <div className="relative mt-16 w-5xl bg-black overflow-hidden py-3">
  {/* Left Gradient Shadow */}
  <div className="absolute left-0 top-0 h-full w-14 z-30 pointer-events-none bg-gradient-to-r from-black to-transparent" />
  
  {/* Right Gradient Shadow */}
  <div className="absolute right-0 top-0 h-full w-14 z-30 pointer-events-none bg-gradient-to-l from-black to-transparent" />

  {/* Scrolling Content */}
  <motion.div
    className="flex gap-10 text-white text-lg font-semibold whitespace-nowrap z-20 relative"
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

      {/* Problem Struggles */}
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
