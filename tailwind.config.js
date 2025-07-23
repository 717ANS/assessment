/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 主要颜色
        'perficient-red': '#CC1F20',
        'perficient-black': '#000000',
        'perficient-white': '#FFFFFF',
        
        // 次要颜色
        'perficient-gold': '#B79967',
        'dark-gray': '#58595B',
        'medium-gray': '#949494',
        'light-gray': '#EBEBE8',
        
        // 第三颜色
        'gray-1': '#222222',
        'gray-2': '#444444',
        'gray-3': '#D1D3D4',
        'gray-4': '#F8F8F8',
        'dark-blue': '#305D6F',
        'light-blue': '#81A7BB',
        
        // 实用颜色
        'dark-red': '#8D0E11',
        'light-red': '#E61717',
        'dark-gold': '#8C734B',
        'light-gold': '#C9B38D',
      },
      transform: {
        'skew-15': 'skew(-15deg)',
        'skew-15-reverse': 'skew(15deg)',
      },
    },
  },
  plugins: [],
} 