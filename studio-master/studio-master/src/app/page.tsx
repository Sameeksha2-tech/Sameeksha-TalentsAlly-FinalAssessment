"use client";

import { useState } from "react";

const quotesList = [
 "Believe you can and you're halfway there.",
    "The best way to get started is to quit talking and begin doing.",
    "Success is not in what you have, but who you are.",
    "Don't watch the clock; do what it does. Keep going.",
    "The harder you work for something, the greater you'll feel when you achieve it.",
    "Dream bigger. Do bigger.",
    "Push yourself, because no one else is going to do it for you.",
    "Great things never come from comfort zones.",
    "Success doesn’t just find you. You have to go out and get it.",
    "The key to success is to focus on goals, not obstacles."
  ];

export default function HomePage() {
  const [quote, setQuote] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  // Filter quotes based on search text
  const filteredQuotes = quotesList.filter(q =>
    q.toLowerCase().includes(search.toLowerCase())
  );

  const handleClick = () => {
    if (filteredQuotes.length === 0) {
      setQuote("No quotes found for your search.");
      return;
    }
    const random = Math.floor(Math.random() * filteredQuotes.length);
    setQuote(filteredQuotes[random]);
  };

  return (
    <main className="p-4 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Motivational Quote Generator
      </h1>

      <input
        type="text"
        placeholder="Search quotes..."
        className="w-full border border-gray-300 rounded p-2 mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button
        onClick={handleClick}
        className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition mb-6"
      >
        Get Quote
      </button>

      {quote && (
        <div className="text-center bg-blue-100 p-4 rounded">
          <p className="italic text-lg">"{quote}"</p>
        </div>
      )}
    </main>
  );
}

