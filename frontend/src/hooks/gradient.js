// Global gradient array
const Gradient = [
  `from-cyan-400 via-blue-500 to-purple-600`,
  `from-emerald-400 via-teal-500 to-cyan-600`,
  `from-orange-400 via-red-500 to-pink-600`,
  `from-purple-400 via-pink-500 to-rose-600`,
  `from-indigo-400 via-blue-500 to-teal-600`,
];

export const getDynamicGradient = (index) => {
  return Gradient[index % Gradient.length];
};
