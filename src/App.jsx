import { useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import Grid from "./components/Grid"
import Dashboard from "./components/Dashboard"
import Terminal from "./components/Terminal"
import Controls from "./components/Controls"
import { useStore } from "./store/useStore"
import { generateWorld } from "./engine/world"
import { WumpusAgent } from "./engine/agent"
import { cloneGrid } from "./utils/helpers"

let agentRef = null
let timerRef = null
let elapsedInterval = null

export default function App() {
  const {
    grid, setGrid, setAgentPos, setRunning, running, speed,
    gridSize, difficulty, resetAll, setStartTime, setElapsed,
    gameOver, gameWon,
    addLog, addKbFact, incrementInferences, incrementResolutions,
    incrementSteps, incrementExplored, addScore, setGameOver, setGameWon,
  } = useStore()

  const initWorld = useCallback(() => {
    resetAll()
    clearInterval(timerRef)
    clearInterval(elapsedInterval)
    agentRef = null

    const newGrid = generateWorld(gridSize, difficulty)
    setGrid(newGrid)

    const dispatch = {
      addLog, addKbFact, incrementInferences, incrementResolutions,
      incrementSteps, incrementExplored, addScore, setGameOver, setGameWon,
    }
    agentRef = new WumpusAgent(cloneGrid(newGrid), gridSize, dispatch)
    setAgentPos({ r: 0, c: 0 })
  }, [gridSize, difficulty])

  // Init on mount and when settings change
  useEffect(() => {
    initWorld()
  }, [gridSize, difficulty])

  // Run loop
  useEffect(() => {
    clearInterval(timerRef)
    clearInterval(elapsedInterval)

    if (!running || !agentRef) return

    const startTs = Date.now()
    setStartTime(startTs)

    elapsedInterval = setInterval(() => {
      setElapsed(Date.now() - startTs)
    }, 500)

    timerRef = setInterval(() => {
      if (!agentRef) { setRunning(false); return }

      const continued = agentRef.step()
      const pos = agentRef.getPos()
      setAgentPos({ r: pos.r, c: pos.c })

      // Sync the agent's grid snapshot back to the store
      // We update individual cell visited/safe flags
      const agGrid = agentRef.grid
      setGrid(agGrid.map((row) => row.map((cell) => ({ ...cell, percepts: { ...cell.percepts } }))))

      if (!continued) {
        setRunning(false)
        clearInterval(timerRef)
        clearInterval(elapsedInterval)
      }
    }, speed)

    return () => {
      clearInterval(timerRef)
      clearInterval(elapsedInterval)
    }
  }, [running, speed])

  const handleRestart = () => {
    setRunning(false)
    setTimeout(initWorld, 100)
  }

  return (
    <div className="min-h-screen bg-black grid-bg text-white p-4 flex flex-col gap-4">
      {/* Header */}
      <motion.header
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1
            className="font-display font-black text-2xl tracking-widest neon-text"
            style={{ letterSpacing: "0.2em" }}
          >
            WUMPUSX AI
          </h1>
          <p className="text-[10px] text-gray-600 tracking-widest uppercase font-mono">
            Knowledge-Based Agent · CNF Resolution Engine
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="btn-neon btn-gold text-xs"
            onClick={handleRestart}
          >
            ↺ New World
          </button>
        </div>
      </motion.header>

      {/* Main Layout */}
      <motion.div
        className="grid gap-4 flex-1"
        style={{ gridTemplateColumns: "1fr 200px 1fr" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {/* Left: Grid */}
        <div className="flex flex-col gap-4">
          <Grid />
        </div>

        {/* Center: Dashboard */}
        <Dashboard />

        {/* Right: Terminal */}
        <Terminal />
      </motion.div>

      {/* Controls */}
      <Controls />

      {/* Footer */}
      <footer className="text-center text-[9px] text-gray-700 font-mono tracking-wider">
        WumpusX AI · Propositional Logic · CNF Conversion · Resolution Refutation · Built with React + Vite
      </footer>
    </div>
  )
}
