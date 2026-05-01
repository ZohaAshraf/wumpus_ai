<div align="center">

<br/>

```
██╗    ██╗██╗   ██╗███╗   ███╗██████╗ ██╗   ██╗███████╗██╗  ██╗     █████╗ ██╗
██║    ██║██║   ██║████╗ ████║██╔══██╗██║   ██║██╔════╝╚██╗██╔╝    ██╔══██╗██║
██║ █╗ ██║██║   ██║██╔████╔██║██████╔╝██║   ██║███████╗ ╚███╔╝     ███████║██║
██║███╗██║██║   ██║██║╚██╔╝██║██╔═══╝ ██║   ██║╚════██║ ██╔██╗     ██╔══██║██║
╚███╔███╔╝╚██████╔╝██║ ╚═╝ ██║██║     ╚██████╔╝███████║██╔╝ ██╗    ██║  ██║██║
 ╚══╝╚══╝  ╚═════╝ ╚═╝     ╚═╝╚═╝      ╚═════╝ ╚══════╝╚═╝  ╚═╝    ╚═╝  ╚═╝╚═╝
```

### Dynamic Knowledge-Based Wumpus World Agent · CNF Conversion · Resolution Refutation

<br/>

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)](YOUR_VERCEL_LINK_HERE)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github&logoColor=white)](YOUR_GITHUB_LINK_HERE)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-ZohaAshraf-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/zoha-ashraf)
[![Medium](https://img.shields.io/badge/Medium-Article-black?style=for-the-badge&logo=medium&logoColor=white)](YOUR_MEDIUM_LINK_HERE)

<br/>

![React](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite_5-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-FF6B35?style=flat-square)
![Framer](https://img.shields.io/badge/Framer_Motion-EF0080?style=flat-square&logo=framer&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

</div>

---

## What is WumpusX AI?

WumpusX AI is a fully interactive simulation of a **Knowledge-Based Agent** navigating the classic Wumpus World — a benchmark problem in AI from Russell & Norvig's *Artificial Intelligence: A Modern Approach* (Chapter 7).

The agent does not guess. It **reasons**. Using propositional logic, a live Knowledge Base, CNF conversion, and resolution refutation, it infers which cells are safe before taking a single step. Every decision is logged in real time to an on-screen reasoning terminal.

This project was built as a university AI assignment and portfolio piece — demonstrating the full pipeline from raw percepts to logical proof.

---

## Live Preview

> 🔗 **[Try the live demo → YOUR_VERCEL_LINK_HERE](YOUR_VERCEL_LINK_HERE)**

---

## Core AI Concepts Implemented

### 1 · Propositional Logic Knowledge Base

The agent maintains a KB of propositional sentences. Every time it enters a cell it **TELLs** percepts to the KB and **ASKs** queries to infer what is safe.

```
B(0,0) ↔ P(1,0) ∨ P(0,1)       ← Breeze rule
S(0,0) ↔ W(1,0) ∨ W(0,1)       ← Stench rule

¬B(0,0) → ¬P(1,0) ∧ ¬P(0,1)   ← No breeze = no adjacent pit
→ Safe(1,0), Safe(0,1)           ← Inferred safe
```

### 2 · CNF Conversion Pipeline

All rules are converted to **Conjunctive Normal Form** before resolution:

| Step | Transformation |
|------|---------------|
| 1 | Biconditional elimination: `A ↔ B` → `(A → B) ∧ (B → A)` |
| 2 | Implication elimination: `A → B` → `¬A ∨ B` |
| 3 | De Morgan's Law: move NOT inward |
| 4 | Distribute OR over AND |
| 5 | Extract individual clauses |

### 3 · Resolution Refutation

To prove a cell `(r,c)` is safe:

```
1. Negate the query:   add ¬Safe(r,c) to clause set
2. Resolve pairs:      find complementary literals, merge clauses
3. Derive empty clause: contradiction found
4. Conclusion:         Safe(r,c) is PROVED ✓
```

### 4 · Agent Navigation Strategy

```
Priority 1 → Move to KB-inferred safe cell  (no computation needed)
Priority 2 → Run resolution refutation       (theorem proving)
Priority 3 → Move to lowest-risk unknown     (heuristic fallback)
```

---

## Features

| Feature | Description |
|---------|-------------|
| 🧠 Live Knowledge Base | Propositional facts update in real time as agent explores |
| 🔄 CNF Engine | Full 4-step pipeline with step-by-step logs |
| ⚔️ Resolution Prover | Automated theorem proving per cell |
| 🌐 Dynamic Grid | 3×3 to 6×6, random worlds, three difficulty levels |
| 📟 AI Terminal | Every inference, CNF step, and resolution op logged live |
| 🌡️ Heatmap Overlay | Risk probability visualization per unvisited cell |
| 🔊 Voice Narration | Web Speech API — "Breeze detected", "Gold found" |
| ⏱️ Speed Controller | Slow / Medium / Fast / Turbo |
| 📤 Export Logs | Download full reasoning history as `.txt` |
| 💀 Full Simulation | Agent dies in pits/wumpus, wins on gold |

---

## Project Structure

```
wumpusx-ai/
├── src/
│   ├── components/
│   │   ├── Grid.jsx              # N×N grid with cell states
│   │   ├── Cell.jsx              # Individual cell (heatmap, icons, percepts)
│   │   ├── Dashboard.jsx         # Agent stats: score, steps, inferences
│   │   ├── Terminal.jsx          # Live AI reasoning log + KB fact viewer
│   │   └── Controls.jsx          # Start/stop, speed, grid size, export
│   │
│   ├── engine/
│   │   ├── world.js              # World generator (pits, wumpus, gold, percepts)
│   │   └── agent.js              # KB-driven AI agent with full reasoning loop
│   │
│   ├── kb/
│   │   └── knowledgeBase.js      # TELL / ASK / forward chaining / inference
│   │
│   ├── resolution/
│   │   ├── cnfConverter.js       # Biconditional → implication → De Morgan → CNF
│   │   └── resolutionEngine.js   # Resolution refutation theorem prover
│   │
│   ├── store/
│   │   └── useStore.js           # Zustand global state
│   │
│   ├── utils/
│   │   └── helpers.js            # Time formatting, log export, color utils
│   │
│   └── styles/
│       └── index.css             # Neon glassmorphism dark theme
│
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher

### Installation

```bash
# Clone the repository
git clone YOUR_GITHUB_LINK_HERE
cd wumpusx-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Deployment

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repository directly at [vercel.com](https://vercel.com) — zero configuration needed, auto-deploys on every push.

### Deploy to GitHub Pages

```bash
npm run build
# Upload the /dist folder to GitHub Pages
```

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| React 18 + Vite 5 | UI framework and build tool |
| Tailwind CSS 3 | Utility-first styling |
| Framer Motion 11 | Animations and transitions |
| Zustand 4 | Lightweight global state management |
| Lucide React | Icon set |
| Web Speech API | Voice narration |

---

## Propositional Variables Reference

| Variable | Meaning |
|----------|---------|
| `B_r_c` | Breeze perceived at cell (r, c) |
| `S_r_c` | Stench perceived at cell (r, c) |
| `P_r_c` | Pit exists at cell (r, c) |
| `W_r_c` | Wumpus exists at cell (r, c) |
| `Safe_r_c` | Cell (r, c) is provably safe |
| `¬X` | Negation of X |

---

## Scoring

| Event | Points |
|-------|--------|
| Grab gold | +1000 |
| Fall in pit | −1000 |
| Eaten by Wumpus | −1000 |
| Each step taken | −1 |

---

## Author

**Zoha Ashraf**
Student at FAST NUCES

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/zoha-ashraf)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black?style=flat-square&logo=github)](https://github.com/ZohaAshraf)
[![Medium](https://img.shields.io/badge/Medium-Read-black?style=flat-square&logo=medium)](YOUR_MEDIUM_LINK_HERE)

---

## License

MIT License — free for academic and portfolio use.

---

<div align="center">

*Built with propositional logic, resolution refutation, and a lot of caffeine.*

⭐ Star this repo if you found it useful

</div>
