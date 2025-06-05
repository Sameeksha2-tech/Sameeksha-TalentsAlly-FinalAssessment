export function generateQuote() {
  const quotes = [
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
  return quotes[Math.floor(Math.random() * quotes.length)];
}
