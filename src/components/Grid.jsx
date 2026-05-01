import { useStore } from "../store/useStore"
import Cell from "./Cell"
import { motion, AnimatePresence } from "framer-motion"

export default function Grid() {
  const grid      = useStore((s) => s.grid)
  const agentPos  = useStore((s) => s.agentPos)
  const gameOver  = useStore((s) => s.gameOver)
  const gameWon   = useStore((s) => s.gameWon)
  const N         = useStore((s) => s.gridSize)

  if (!grid.length) return (
    <div className="flex items-center justify-center h-64 neon-border rounded-xl glass">
      <span className="text-gray-500 text-sm font-mono">Initializing world...</span>
    </div>
  )

  return (
    <div className="relative">
      <div
        className="grid gap-2 p-4 neon-border rounded-xl glass"
        style={{ gridTemplateColumns: `repeat(${N}, 1fr)` }}
      >
        {grid.map((row) =>
          row.map((cell) => {
            const isAgent = cell.r === agentPos.r && cell.c === agentPos.c
            return (
              <Cell key={`${cell.r}-${cell.c}`} cell={cell} isAgent={isAgent} />
            )
          })
        )}
      </div>

      {/* Game Over Overlay */}
      <AnimatePresence>
        {gameOver && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center rounded-xl"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">💀</div>
              <div className="text-red-400 font-display text-xl font-bold">GAME OVER</div>
              <div className="text-gray-400 text-xs mt-1">Agent perished</div>
            </div>
          </motion.div>
        )}

        {gameWon && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center rounded-xl"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">★</div>
              <div className="font-display text-xl font-bold" style={{ color: "#ffd700" }}>GOLD FOUND</div>
              <div className="text-gray-400 text-xs mt-1">Mission accomplished</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
