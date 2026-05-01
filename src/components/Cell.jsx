import { motion } from "framer-motion"
import { useStore } from "../store/useStore"
import { riskToColor } from "../utils/helpers"

const ICONS = {
  pit:    "●",
  wumpus: "☠",
  gold:   "★",
  agent:  "◈",
}

export default function Cell({ cell, isAgent }) {
  const showHeatmap = useStore((s) => s.showHeatmap)
  const gameOver    = useStore((s) => s.gameOver)
  const gameWon     = useStore((s) => s.gameWon)
  const revealed    = gameOver || gameWon

  const getClass = () => {
    if (isAgent) return "cell-agent"
    if (cell.visited && cell.safe) return "cell-safe"
    if (revealed && (cell.pit || cell.wumpus)) return "cell-danger"
    if (cell.safe) return "cell-safe"
    return "cell-unknown"
  }

  const getIcon = () => {
    if (isAgent) return ICONS.agent
    if (cell.visited || revealed) {
      if (cell.gold && !isAgent) return ICONS.gold
      if (cell.pit) return "●"
      if (cell.wumpus) return "☠"
    }
    if (cell.visited && cell.percepts?.breeze && cell.percepts?.stench) return "BS"
    if (cell.visited && cell.percepts?.breeze) return "B"
    if (cell.visited && cell.percepts?.stench) return "S"
    return ""
  }

  const icon = getIcon()

  return (
    <motion.div
      className={`relative w-full aspect-square flex flex-col items-center justify-center rounded-lg cursor-default select-none ${getClass()}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.05 }}
    >
      {/* Heatmap overlay */}
      {showHeatmap && !cell.visited && (
        <div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{ background: riskToColor(cell.riskScore || 0) }}
        />
      )}

      {/* Row/col label */}
      <span
        className="absolute top-1 left-1 text-[8px] opacity-30"
        style={{ fontFamily: "JetBrains Mono, monospace" }}
      >
        {cell.r},{cell.c}
      </span>

      {/* Main icon */}
      <span
        className="text-lg z-10"
        style={{
          color: isAgent
            ? "#00f5ff"
            : cell.pit
            ? "#ff4d4d"
            : cell.wumpus
            ? "#ff6b00"
            : cell.gold
            ? "#ffd700"
            : "inherit",
          textShadow: isAgent ? "0 0 10px #00f5ff" : "none",
        }}
      >
        {icon}
      </span>

      {/* Percept hints for visited cells */}
      {cell.visited && !isAgent && (
        <div className="flex gap-0.5 absolute bottom-1">
          {cell.percepts?.breeze && (
            <span className="text-[7px] text-blue-300 opacity-60">B</span>
          )}
          {cell.percepts?.stench && (
            <span className="text-[7px] text-yellow-300 opacity-60">S</span>
          )}
        </div>
      )}

      {/* Risk score hint */}
      {showHeatmap && !cell.visited && (
        <span className="text-[8px] opacity-40 z-10">
          {(cell.riskScore || 0).toFixed(1)}
        </span>
      )}
    </motion.div>
  )
}
