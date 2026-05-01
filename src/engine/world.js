/**
 * World Generator — creates and manages the Wumpus World grid.
 */
import { neighbors } from "../kb/knowledgeBase.js"

const DIFFICULTY = {
  easy:   { pitProb: 0.12, hasWumpus: true },
  medium: { pitProb: 0.20, hasWumpus: true },
  hard:   { pitProb: 0.28, hasWumpus: true },
}

/** Generate a fresh Wumpus World grid of size N×N */
export function generateWorld(N, difficulty = "medium") {
  const cfg = DIFFICULTY[difficulty] || DIFFICULTY.medium

  // Create blank grid
  const grid = Array.from({ length: N }, (_, r) =>
    Array.from({ length: N }, (_, c) => ({
      r, c,
      pit: false,
      wumpus: false,
      gold: false,
      visited: false,
      safe: false,
      danger: false,
      percepts: { breeze: false, stench: false, glitter: false },
      riskScore: 0,
    }))
  )

  // Place pits (not at start [0,0])
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (r === 0 && c === 0) continue
      if (Math.random() < cfg.pitProb) {
        grid[r][c].pit = true
      }
    }
  }

  // Place Wumpus (not at start, not on a pit)
  if (cfg.hasWumpus) {
    let placed = false
    let attempts = 0
    while (!placed && attempts < 100) {
      attempts++
      const wr = Math.floor(Math.random() * N)
      const wc = Math.floor(Math.random() * N)
      if (!(wr === 0 && wc === 0) && !grid[wr][wc].pit) {
        grid[wr][wc].wumpus = true
        placed = true
      }
    }
  }

  // Place gold (not at start, not on pit, not on wumpus)
  let goldPlaced = false
  let attempts = 0
  while (!goldPlaced && attempts < 100) {
    attempts++
    const gr = Math.floor(Math.random() * N)
    const gc = Math.floor(Math.random() * N)
    if (!(gr === 0 && gc === 0) && !grid[gr][gc].pit && !grid[gr][gc].wumpus) {
      grid[gr][gc].gold = true
      goldPlaced = true
    }
  }

  // Compute percepts
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const nbrs = neighbors(r, c, N)
      for (const [nr, nc] of nbrs) {
        if (grid[nr][nc].pit)    grid[r][c].percepts.breeze  = true
        if (grid[nr][nc].wumpus) grid[r][c].percepts.stench  = true
      }
      if (grid[r][c].gold) grid[r][c].percepts.glitter = true
    }
  }

  // Mark start as safe and visited
  grid[0][0].safe = true
  grid[0][0].visited = true

  // Compute initial risk scores (0..1)
  computeRisk(grid, N)

  return grid
}

/** Compute heuristic risk for unvisited cells */
export function computeRisk(grid, N) {
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (grid[r][c].visited) { grid[r][c].riskScore = 0; continue }
      // Count visited breeze neighbours
      let breezyNeighbours = 0, total = 0
      for (const [nr, nc] of neighbors(r, c, N)) {
        if (grid[nr][nc].visited) {
          total++
          if (grid[nr][nc].percepts.breeze) breezyNeighbours++
        }
      }
      grid[r][c].riskScore = total > 0 ? breezyNeighbours / total : 0.3
    }
  }
}
