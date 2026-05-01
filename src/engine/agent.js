/**
 * AI Agent — Knowledge-Based Wumpus World Explorer
 * Uses KB + Resolution to navigate safely.
 */
import { KnowledgeBase, encodePercepts, inferSafeCells, neighbors } from "../kb/knowledgeBase.js"
import { toCNF, breezeRule, stenchRule } from "../resolution/cnfConverter.js"
import { provesSafe } from "../resolution/resolutionEngine.js"
import { computeRisk } from "./world.js"

export class WumpusAgent {
  constructor(grid, N, dispatch) {
    this.grid = grid
    this.N = N
    this.dispatch = dispatch // { addLog, addKbFact, incrementInferences, incrementResolutions, incrementSteps, incrementExplored, addScore, setGameOver, setGameWon }
    this.kb = new KnowledgeBase()
    this.pos = { r: 0, c: 0 }
    this.visited = new Set(["0_0"])
    this.safeQueue = []
    this.deadCells = new Set()
    this.alive = true
    this.goldGrabbed = false
    this.hasArrow = true

    // Encode start cell
    this.perceiveAt(0, 0)
  }

  log(text, type = "info") {
    this.dispatch.addLog({ text, type })
  }

  perceiveAt(r, c) {
    const cell = this.grid[r][c]
    const percepts = cell.percepts

    this.log(`[PERCEIVE] Cell (${r},${c}) — Breeze:${percepts.breeze} Stench:${percepts.stench} Glitter:${percepts.glitter}`, "percept")

    // Update KB with percepts
    encodePercepts(this.kb, r, c, percepts, this.N)
    this.dispatch.addKbFact(`Visited_${r}_${c}`)
    if (percepts.breeze) { this.dispatch.addKbFact(`B_${r}_${c}`) }
    else { this.dispatch.addKbFact(`¬B_${r}_${c}`) }
    if (percepts.stench) { this.dispatch.addKbFact(`S_${r}_${c}`) }
    else { this.dispatch.addKbFact(`¬S_${r}_${c}`) }

    // Add CNF rules for this cell
    const nbrs = neighbors(r, c, this.N)
    const bRule = breezeRule(r, c, nbrs)
    const sRule = stenchRule(r, c, nbrs)
    const bCNF = toCNF(bRule)
    const sCNF = toCNF(sRule)
    this.log(`[CNF] ${bCNF.steps[bCNF.steps.length - 1].label}: ${bCNF.steps[bCNF.steps.length - 1].expr}`, "cnf")
    this.log(`[CNF] ${sCNF.steps[sCNF.steps.length - 1].label}: ${sCNF.steps[sCNF.steps.length - 1].expr}`, "cnf")
    this.dispatch.incrementInferences()

    // Infer safe cells
    const safeCells = inferSafeCells(this.kb, r, c, this.N)
    for (const [sr, sc] of safeCells) {
      const key = `${sr}_${sc}`
      this.dispatch.addKbFact(`Safe_${sr}_${sc}`)
      this.grid[sr][sc].safe = true
      if (!this.visited.has(key) && !this.safeQueue.find((s) => s.r === sr && s.c === sc)) {
        this.safeQueue.push({ r: sr, c: sc })
        this.log(`[KB] Inferred SAFE: (${sr},${sc})`, "safe")
      }
    }

    // Gold!
    if (percepts.glitter && !this.goldGrabbed) {
      this.goldGrabbed = true
      this.dispatch.addScore(1000)
      this.log(`[AGENT] ★ GOLD GRABBED at (${r},${c})! +1000pts`, "gold")
      this.dispatch.setGameWon(true)
    }

    // Voice
    if (percepts.breeze) this.speak("Breeze detected. Possible pit nearby.")
    if (percepts.stench) this.speak("Stench detected. Wumpus is close.")
    if (percepts.glitter) this.speak("Gold found! Grabbing it now.")
  }

  speak(text) {
    if (typeof window !== "undefined" && window.__wumpus_voice) {
      const utter = new window.SpeechSynthesisUtterance(text)
      utter.rate = 0.9
      window.speechSynthesis.speak(utter)
    }
  }

  /** Choose next cell to move to */
  chooseMove() {
    // Prefer safe-queue cells
    while (this.safeQueue.length > 0) {
      const next = this.safeQueue.shift()
      const key = `${next.r}_${next.c}`
      if (!this.visited.has(key) && !this.deadCells.has(key)) {
        return next
      }
    }

    // No safe cells — try resolution on unvisited neighbours
    const nbrs = neighbors(this.pos.r, this.pos.c, this.N)
    for (const [nr, nc] of nbrs) {
      const key = `${nr}_${nc}`
      if (!this.visited.has(key) && !this.deadCells.has(key)) {
        this.log(`[RESOLVE] Testing (${nr},${nc}) for safety...`, "resolve")
        const result = provesSafe([...this.kb.allFacts()], nr, nc)
        this.dispatch.incrementResolutions()
        for (const step of result.steps.slice(-3)) {
          this.log(`  ${step.message}`, "resolve")
        }
        if (result.proved) {
          this.grid[nr][nc].safe = true
          this.dispatch.addKbFact(`Safe_${nr}_${nc}`)
          this.log(`[RESOLVE] PROVED SAFE: (${nr},${nc})`, "safe")
          return { r: nr, c: nc }
        }
      }
    }

    // Explore least-risky unknown cell
    computeRisk(this.grid, this.N)
    let best = null
    let bestRisk = Infinity
    for (let r = 0; r < this.N; r++) {
      for (let c = 0; c < this.N; c++) {
        const key = `${r}_${c}`
        if (!this.visited.has(key) && !this.deadCells.has(key)) {
          if (this.grid[r][c].riskScore < bestRisk) {
            bestRisk = this.grid[r][c].riskScore
            best = { r, c }
          }
        }
      }
    }
    if (best) {
      this.log(`[AGENT] Exploring risky cell (${best.r},${best.c}) risk=${bestRisk.toFixed(2)}`, "warn")
    }
    return best
  }

  /** Perform one step */
  step() {
    if (!this.alive || this.goldGrabbed) return false

    const next = this.chooseMove()
    if (!next) {
      this.log("[AGENT] No moves available. Exploration complete.", "info")
      return false
    }

    this.pos = next
    const key = `${next.r}_${next.c}`
    this.visited.add(key)
    this.grid[next.r][next.c].visited = true
    this.dispatch.incrementSteps()
    this.dispatch.addScore(-1)

    this.log(`[MOVE] → (${next.r},${next.c})`, "move")

    // Check hazards
    if (this.grid[next.r][next.c].pit) {
      this.alive = false
      this.dispatch.addScore(-1000)
      this.log(`[AGENT] ✗ FELL IN PIT at (${next.r},${next.c})! -1000pts`, "danger")
      this.dispatch.setGameOver(true)
      this.speak("I fell into a pit. Game over.")
      return false
    }

    if (this.grid[next.r][next.c].wumpus) {
      this.alive = false
      this.dispatch.addScore(-1000)
      this.log(`[AGENT] ✗ EATEN BY WUMPUS at (${next.r},${next.c})! -1000pts`, "danger")
      this.dispatch.setGameOver(true)
      this.speak("The wumpus got me. Game over.")
      return false
    }

    this.dispatch.incrementExplored()
    this.perceiveAt(next.r, next.c)
    return true
  }

  getPos() { return this.pos }
  isAlive() { return this.alive }
  hasGold() { return this.goldGrabbed }
}
