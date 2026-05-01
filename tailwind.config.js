export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        neon: "#00f5ff",
        danger: "#ff4d4d",
        safe: "#00ff9f",
        unknown: "#888",
        wumpus: "#ff6b00",
        gold: "#ffd700"
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "monospace"],
        display: ["'Orbitron'", "sans-serif"]
      },
      animation: {
        pulse2: "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        flicker: "flicker 2s infinite",
        scanline: "scanline 3s linear infinite"
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.85 }
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" }
        }
      }
    }
  },
  plugins: []
}
