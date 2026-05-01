/**
 * Knowledge Base — propositional logic facts for the Wumpus World agent.
 * Supports TELL (add fact), ASK (query fact), and retrieval helpers.
 */
export class KnowledgeBase {
  constructor() {
    this.facts = new Set()
    this.rules = []
  }

  /** Add a proposition to the KB */
  tell(sentence) {
    this.facts.add(sentence)
    return sentence
  }

  /** Check if a proposition is entailed */
  ask(query) {
    return this.facts.has(query)
  }

  /** Add an implication rule: antecedents[] => consequent */
  addRule(antecedents, consequent) {
    this.rules.push({ antecedents, consequent })
  }

  /** Forward-chain all rules and derive new facts */
  forwardChain() {
    let derived = []
    let changed = true
    while (changed) {
      changed = false
      for (const rule of this.rules) {
        if (rule.antecedents.every((a) => this.facts.has(a)) && !this.facts.has(rule.consequent)) {
          this.facts.add(rule.consequent)
          derived.push(rule.consequent)
          changed = true
        }
      }
    }
    return derived
  }

  /** Retrieve all facts containing a substring */
  getFacts(filter) {
    if (!filter) return [...this.facts]
    return [...this.facts].filter((f) => f.includes(filter))
  }

  /** Get all facts as sorted array */
  allFacts() {
    return [...this.facts].sort()
  }

  /** Clear all facts */
  reset() {
    this.facts.clear()
    this.rules = []
  }
}

/**
 * Encode Wumpus-world percept rules for cell (r,c) in a grid of size N.
 * Uses propositional variables:
 *   B_r_c  = Breeze at (r,c)
 *   S_r_c  = Stench at (r,c)
 *   P_r_c  = Pit at (r,c)
 *   W_r_c  = Wumpus at (r,c)
 *   Safe_r_c = Cell is safe
 */
export function encodePercepts(kb, r, c, percepts, N) {
  if (percepts.breeze) {
    kb.tell(`B_${r}_${c}`)
  } else {
    kb.tell(`¬B_${r}_${c}`)
    // No breeze => no pit in any adjacent cell
    for (const [nr, nc] of neighbors(r, c, N)) {
      kb.tell(`¬P_${nr}_${nc}`)
    }
  }

  if (percepts.stench) {
    kb.tell(`S_${r}_${c}`)
  } else {
    kb.tell(`¬S_${r}_${c}`)
    // No stench => no wumpus in any adjacent cell
    for (const [nr, nc] of neighbors(r, c, N)) {
      kb.tell(`¬W_${nr}_${nc}`)
    }
  }
}

/** Infer safety of adjacent cells from KB */
export function inferSafeCells(kb, r, c, N) {
  const safe = []
  for (const [nr, nc] of neighbors(r, c, N)) {
    if (kb.ask(`¬P_${nr}_${nc}`) && kb.ask(`¬W_${nr}_${nc}`)) {
      kb.tell(`Safe_${nr}_${nc}`)
      safe.push([nr, nc])
    }
  }
  return safe
}

/** Get neighbors within grid bounds */
export function neighbors(r, c, N) {
  return [
    [r - 1, c],
    [r + 1, c],
    [r, c - 1],
    [r, c + 1],
  ].filter(([nr, nc]) => nr >= 0 && nr < N && nc >= 0 && nc < N)
}
