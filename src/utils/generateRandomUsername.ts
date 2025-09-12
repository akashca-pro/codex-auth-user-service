export const generateUniqueUsername = (): string => {
  const adjectives = [
    "code", "debug", "stack", "script", "binary", "async", "dev", "logic",
    "muscle", "cyber", "byte", "cloud", "terminal", "syntax", "pixel", "node"
  ];

  const nouns = [
    "wizard", "ninja", "vampire", "hacker", "guru", "pirate", "engineer",
    "samurai", "architect", "sniper", "ghost", "bot", "monk", "sorcerer"
  ];

  const separator = ["", "_", "-", "."];
  const randomNumber = Math.floor(Math.random() * 9000) + 1000;

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const sep = separator[Math.floor(Math.random() * separator.length)];

  return `${adj}${sep}${noun}${randomNumber}`;
};