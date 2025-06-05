"use client";

import { useState, useEffect } from "react";

const quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "Don't let yesterday take up too much of today.", author: "Will Rogers" },
  { text: "You learn more from failure than from success.", author: "Unknown" },
];

export default function Quote() {
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    const random = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[random]);
  }, []);

  return (
    <div className="text-center my-6 p-4 bg-blue-100 rounded max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-2">Motivational Quote</h2>
      <p className="italic">"{quote.text}"</p>
      <p className="mt-2 text-sm text-gray-700">— {quote.author}</p>
    </div>
  );
}
