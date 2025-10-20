// Global gradient array - Enhanced for modern look
const Gradient = [
  // Blue to Purple (Modern Tech)
  `from-blue-500 via-indigo-500 to-purple-600`,
  // Emerald to Cyan (Growth)
  `from-emerald-500 via-teal-500 to-cyan-600`,
  // Orange to Pink (Innovation)
  `from-orange-400 via-red-500 to-pink-600`,
  // Purple to Rose (Leadership)
  `from-purple-400 via-pink-500 to-rose-600`,
  // Indigo to Blue (Strategy)
  `from-indigo-500 via-blue-500 to-cyan-600`,
];

// Get gradient with opacity variant
export const getDynamicGradient = (index, opacity = 100) => {
  const baseGradient = Gradient[index % Gradient.length];
  return opacity === 100
    ? baseGradient
    : baseGradient.replace(/\d{3}/g, (match) => `${match}/${opacity}`);
};

// For background patterns
export const getBackgroundGradient = (index) => {
  return getDynamicGradient(index, 10); // 10% opacity for backgrounds
};
