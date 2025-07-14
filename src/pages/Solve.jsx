// src/pages/SolverPage.jsx
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

const allLanguages = [
  "C++", "Java", "Python", "Python3", "C", "C#",
  "JavaScript", "TypeScript", "PHP", "Swift",
  "Kotlin", "Go", "Ruby", "Scala", "Rust"
];

const SolverPage = () => {
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
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">🧠 SolveStack: DSA Coach Bot</h1>

      {/* Language Dropdown */}
      <div className="w-full max-w-3xl mb-6" ref={dropdownRef}>
        <p className="text-lg font-semibold mb-2">Choose language:</p>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="w-full border border-gray-300 bg-white px-4 py-2 rounded-md text-left shadow-sm"
          >
            {selectedLang || "Select language"}
          </button>

          {dropdownOpen && (
            <div className="absolute z-10 w-full mt-2 bg-white border rounded shadow max-h-60 overflow-y-auto">
              {allLanguages.map((lang) => (
                <div
                  key={lang}
                  onClick={() => {
                    setSelectedLang(lang);
                    setDropdownOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {lang}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <textarea
        rows="8"
        className="w-full max-w-3xl p-4 border rounded-lg shadow-sm focus:outline-indigo-600 mb-4"
        placeholder="Paste your DSA question here..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition mb-6"
      >
        {loading ? "Explaining..." : "Generate Explanation"}
      </button>

      {error && (
        <div className="text-red-600 font-medium mb-4">{error}</div>
      )}

      {response && (
        <div className="w-full max-w-3xl bg-white p-6 rounded-xl shadow-md prose prose-indigo">
          <ReactMarkdown>{response}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default SolverPage;
