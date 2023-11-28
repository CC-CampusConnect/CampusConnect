/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',

        /* Text 색상 토큰 */
        'orange-600': '#FF9730',
        'brown':'#643D18',
        'white':'#FFFFFF',
        'black':'#000000', 
        'gray':'#A6A6A6',
        'red':'#B00020',
        

        /* Background 색상 토큰 */
        'white-gray':'#F8F8F8',
        'pink-500':'#FF8967',
        'gray-200':'#DBDBDB', /* +) Background-Button 토큰 */
        'orange-400':'#FFAA5B', /* +) Background-Button 토큰 */


        /* Background-Button 색상 토큰 */
        'pink-500':'#FF8967',
      },

      /* 폰트 크기 토큰 */
      fontSize:{
        'xxl':'45px',
        'xl':'40px',
        'lg':'32px',
        'md':'26px',
        'sm':'20px',
        'ssm':'16px',
        'xs':'14px',
      },
    },   
  },
  plugins: [],
};
