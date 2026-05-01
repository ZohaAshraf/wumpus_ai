import { useStore } from "../store/useStore"
import { exportLogs } from "../utils/helpers"

export default function Controls() {
  const running      = useStore((s) => s.running)
  const speed        = useStore((s) => s.speed)
  const showHeatmap  = useStore((s) => s.showHeatmap)
  const voiceEnabled = useStore((s) => s.voiceEnabled)
  const gridSize     = useStore((s) => s.gridSize)
  const difficulty   = useStore((s) => s.difficulty)
  const logs         = useStore((s) => s.logs)
  const gameOver     = useStore((s) => s.gameOver)
  const gameWon      = useStore((s) => s.gameWon)

  const setRunning    = useStore((s) => s.setRunning)
  const setSpeed      = useStore((s) => s.setSpeed)
  const toggleHeatmap = useStore((s) => s.toggleHeatmap)
  const toggleVoice   = useStore((s) => s.toggleVoice)
  const setGridSize   = useStore((s) => s.setGridSize)
  const setDifficulty = useStore((s) => s.setDifficulty)

  const speedLabels = { 800: "Slow", 500: "Med", 250: "Fast", 80: "Turbo" }
  const stopped = gameOver || gameWon

  const handleVoice = () => {
    toggleVoice()
    window.__wumpus_voice = !voiceEnabled
  }

  return (
    <div className="neon-border rounded-xl glass p-4 flex flex-wrap items-center gap-4">
      {/* Start / Stop */}
      <div className="flex gap-2">
        <button
          className="btn-neon"
          onClick={() => setRunning(true)}
          disabled={running || stopped}
          style={{ opacity: running || stopped ? 0.4 : 1 }}
        >
          ▶ Start
        </button>
        <button
          className="btn-neon btn-danger"
          onClick={() => setRunning(false)}
          disabled={!running}
          style={{ opacity: !running ? 0.4 : 1 }}
        >
          ■ Stop
        </button>
      </div>

      {/* Speed slider */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-gray-500 font-display uppercase tracking-wider">Speed:</span>
        <select
          className="bg-black border border-white/10 text-gray-300 text-xs px-2 py-1 rounded font-mono"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        >
          {Object.entries(speedLabels).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      {/* Grid size */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-gray-500 font-display uppercase tracking-wider">Grid:</span>
        <select
          className="bg-black border border-white/10 text-gray-300 text-xs px-2 py-1 rounded font-mono"
          value={gridSize}
          onChange={(e) => setGridSize(Number(e.target.value))}
          disabled={running}
        >
          {[3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>{n}×{n}</option>
          ))}
        </select>
      </div>

      {/* Difficulty */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-gray-500 font-display uppercase tracking-wider">Difficulty:</span>
        <select
          className="bg-black border border-white/10 text-gray-300 text-xs px-2 py-1 rounded font-mono"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          disabled={running}
        >
          {["easy", "medium", "hard"].map((d) => (
            <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Toggle buttons */}
      <div className="flex gap-2 ml-auto">
        <button
          className={`btn-neon ${showHeatmap ? "bg-cyan-900/30" : ""}`}
          onClick={toggleHeatmap}
        >
          {showHeatmap ? "⬛" : "🌡"} Heatmap
        </button>
        <button
          className={`btn-neon ${voiceEnabled ? "bg-purple-900/30" : ""}`}
          onClick={handleVoice}
        >
          {voiceEnabled ? "🔊" : "🔇"} Voice
        </button>
        <button
          className="btn-neon btn-gold"
          onClick={() => exportLogs(logs)}
        >
          ↓ Export Logs
        </button>
      </div>
    </div>
  )
}
