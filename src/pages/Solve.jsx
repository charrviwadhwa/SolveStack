// src/pages/SolverPage.jsx
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FiChevronDown, FiClipboard } from "react-icons/fi";

const allLanguages = [
  "C++", "Java", "Python", "Python3", "C", "C#",
  "JavaScript", "TypeScript", "PHP", "Swift",
  "Kotlin", "Go", "Ruby", "Scala", "Rust"
];

const Solve = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedLang, setSelectedLang] = useState("Python");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleSubmit = async () => {
    if (!question.trim()) {
      setError("Please paste a DSA question.");
      return;
    }

    setLoading(true);
    setError("");
    setResponse("");

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, languages: [selectedLang] }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setResponse(data.response);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050510] via-[#0c001c] to-[#000] text-white p-6 flex flex-col items-center relative">
      <div className="absolute inset-0 bg-gradient-radial from-purple-900/10 via-transparent to-transparent z-0" />

<div className="flex items-center gap-3 mb-6">
  <img src="/logo2.png" alt="SolveStack Logo" className="h-10 w-10" />
  <h1 className="text-3xl font-extrabold text-white">SolveStack: DSA Coach Bot</h1>
</div>

      
      

      {/* Language Dropdown */}
      <div className="relative w-full max-w-3xl mb-6 z-50">
  <p className="text-lg font-semibold mb-2">Choose language:</p>

  <div className="relative">
    <button
      onClick={() => setDropdownOpen((prev) => !prev)}
      className="w-full border border-gray-600 bg-gray-900 px-4 py-2 rounded-md text-left flex justify-between items-center"
    >
      {selectedLang || "Select language"}
      <span className="ml-2">&#9662;</span> {/* ▼ icon */}
    </button>

    {dropdownOpen && (
      <div className="absolute z-20 w-full mt-2 bg-gray-900 border border-gray-700 rounded shadow max-h-60 overflow-y-auto">
        {allLanguages.map((lang) => (
          <div
            key={lang}
            onClick={() => {
              setSelectedLang(lang);
              setDropdownOpen(false);
            }}
            className="px-4 py-2 hover:bg-gray-800 cursor-pointer"
          >
            {lang}
          </div>
        ))}
      </div>
    )}
  </div>
</div>


      {/* Question Textarea */}
      <textarea
        rows="8"
        className="w-full max-w-3xl p-4 border border-gray-700 rounded-lg shadow-sm focus:outline-purple-500 bg-gray-950 text-white placeholder-gray-400 mb-4 z-10"
        placeholder="Paste your DSA question here..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-purple-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-purple-700 transition mb-6 z-10"
      >
        {loading ? "Explaining..." : "Generate Explanation"}
      </button>

      {error && (
        <div className="text-red-500 font-medium mb-4">{error}</div>
      )}

      {/* Output */}
      {response && (
        <div className="w-full max-w-3xl bg-gray-950 p-6 rounded-xl shadow-md space-y-4 z-10 border border-gray-800">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline ? (
                  <div className="relative group">
                    <button
                      onClick={() => handleCopy(children)}
                      className="absolute top-2 right-2 text-sm text-white bg-gray-700 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                    >
                      <FiClipboard className="inline-block mr-1" /> Copy
                    </button>
                    <SyntaxHighlighter
                      language={match?.[1] || "text"}
                      style={oneDark}
                      customStyle={{ padding: "1rem", borderRadius: "0.5rem" }}
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code className="bg-gray-800 px-1 py-0.5 rounded text-sm text-purple-300">{children}</code>
                );
              },
              a({ href, children }) {
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline hover:text-blue-300"
                  >
                    {children}
                  </a>
                );
              },
              h2({ children }) {
                return <h2 className="text-2xl font-bold text-purple-300 mt-6 mb-2">{children}</h2>;
              },
              h3({ children }) {
                return <h3 className="text-xl font-semibold text-purple-200 mt-4 mb-1">{children}</h3>;
              },
              p({ children }) {
                return <p className="text-gray-300 mb-3 leading-relaxed">{children}</p>;
              },
              ul({ children }) {
                return <ul className="list-disc list-inside text-gray-300 space-y-1">{children}</ul>;
              },
            }}
          >
            {response}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default Solve;
