/** Format milliseconds into mm:ss */
export function formatTime(ms) {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  return `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`
}

/** Export logs as text file */
export function exportLogs(logs) {
  const content = logs.map((l) => `[${l.type.toUpperCase()}] ${l.text}`).join("\n")
  const blob = new Blob([content], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `wumpusx-log-${Date.now()}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

/** Clone a grid deeply */
export function cloneGrid(grid) {
  return grid.map((row) => row.map((cell) => ({ ...cell, percepts: { ...cell.percepts } })))
}

/** Get color for log type */
export function logColor(type) {
  switch (type) {
    case "percept":  return "#a78bfa"
    case "cnf":      return "#38bdf8"
    case "resolve":  return "#fb923c"
    case "safe":     return "#4ade80"
    case "danger":   return "#f87171"
    case "move":     return "#00f5ff"
    case "gold":     return "#fbbf24"
    case "warn":     return "#facc15"
    default:         return "#94a3b8"
  }
}

/** Risk score to rgba color */
export function riskToColor(score) {
  const r = Math.round(255 * score)
  const g = Math.round(255 * (1 - score))
  return `rgba(${r},${g},30,0.35)`
}
