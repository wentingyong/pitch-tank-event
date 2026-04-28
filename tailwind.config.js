/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', "ui-sans-serif", "system-ui"],
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        num: ['"Space Grotesk"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        bg: "#070B12",
        surface: "#0B1220",
        elev: "#0F1726",
        line: "rgba(255,255,255,0.08)",
        blue: "#2A78FF",
        cyan: "#23D6FF",
        mint: "#40F3C5",
        orange: "#FF8A2B",
        purple: "#8A5CFF",
        lilac: "#F096FF",
        muted: "#A7B3C9",
      },
    },
  },
  plugins: [],
};
