/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
     /* colors: {
        'nova-blue': '#1e40af', // สีน้ำเงินธีม NovaPay
        'nova-green': '#10b981', // สีเขียวปุ่ม
      }*/
    },
  },
  //  ใส่ daisyui เข้าไปใน plugins
  plugins: [
    require('daisyui'),
  ],
  //  ตั้งค่าให้ใช้ธีม Light เป็นหลัก 
  daisyui: {
    themes: ["light"],
  },
}