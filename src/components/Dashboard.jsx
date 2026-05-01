import { useStore } from "../store/useStore"
import { formatTime } from "../utils/helpers"

function StatCard({ label, value, color = "#00f5ff" }) {
  return (
    <div className="stat-card flex flex-col gap-1">
      <span className="text-[9px] uppercase tracking-widest text-gray-500 font-display">{label}</span>
      <span className="text-xl font-bold font-display" style={{ color }}>
        {value}
      </span>
    </div>
  )
}

export default function Dashboard() {
  const steps        = useStore((s) => s.steps)
  const inferences   = useStore((s) => s.inferences)
  const resolutions  = useStore((s) => s.resolutions)
  const cellsExplored = useStore((s) => s.cellsExplored)
  const score        = useStore((s) => s.score)
  const elapsed      = useStore((s) => s.elapsed)
  const kbFacts      = useStore((s) => s.kbFacts)
  const agentPos     = useStore((s) => s.agentPos)
  const running      = useStore((s) => s.running)
  const gameOver     = useStore((s) => s.gameOver)
  const gameWon      = useStore((s) => s.gameWon)

  const status = gameOver ? "DEAD" : gameWon ? "WON" : running ? "ACTIVE" : "IDLE"
  const statusColor = gameOver ? "#f87171" : gameWon ? "#fbbf24" : running ? "#4ade80" : "#888"

  return (
    <div className="flex flex-col gap-3">
      {/* Status */}
      <div className="neon-border rounded-xl glass p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-display text-gray-400 tracking-widest uppercase">Agent Status</span>
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: statusColor,
                boxShadow: `0 0 6px ${statusColor}`,
                animation: running ? "pulse 1s infinite" : "none",
              }}
            />
            <span className="text-xs font-display" style={{ color: statusColor }}>
              {status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <StatCard label="Position" value={`(${agentPos.r},${agentPos.c})`} />
          <StatCard label="Score" value={score} color={score >= 0 ? "#4ade80" : "#f87171"} />
          <StatCard label="Steps" value={steps} />
          <StatCard label="Time" value={formatTime(elapsed)} color="#a78bfa" />
        </div>
      </div>

      {/* AI Metrics */}
      <div className="neon-border rounded-xl glass p-4">
        <div className="text-xs font-display text-gray-400 tracking-widest uppercase mb-3">AI Metrics</div>
        <div className="grid grid-cols-2 gap-2">
          <StatCard label="Inferences" value={inferences} color="#38bdf8" />
          <StatCard label="Resolutions" value={resolutions} color="#fb923c" />
          <StatCard label="Explored" value={cellsExplored} color="#4ade80" />
          <StatCard label="KB Facts" value={kbFacts.length} color="#a78bfa" />
        </div>
      </div>

      {/* Legend */}
      <div className="neon-border rounded-xl glass p-4">
        <div className="text-xs font-display text-gray-400 tracking-widest uppercase mb-3">Legend</div>
        <div className="flex flex-col gap-2">
          {[
            { color: "#00f5ff", label: "◈  Agent" },
            { color: "#00ff9f", label: "■  Safe / Visited" },
            { color: "#ff4d4d", label: "●  Pit" },
            { color: "#ff6b00", label: "☠  Wumpus" },
            { color: "#ffd700", label: "★  Gold" },
            { color: "#888",    label: "■  Unknown" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ background: color, opacity: 0.6 }} />
              <span className="text-xs font-mono text-gray-400">{label}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-white/5">
          <div className="text-[9px] font-mono text-gray-600">
            <div>B = Breeze detected</div>
            <div>S = Stench detected</div>
          </div>
        </div>
      </div>
    </div>
  )
}
