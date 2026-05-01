/**
 * CNF Converter — converts propositional logic formulas to
 * Conjunctive Normal Form (CNF) via standard transformations.
 *
 * Supported syntax (string-based):
 *   NOT A        →  ¬A
 *   A AND B      →  A ∧ B
 *   A OR B       →  A ∨ B
 *   A => B       →  implication
 *   A <=> B      →  biconditional
 */

/** Step 1: Eliminate biconditionals: A <=> B  →  (A => B) ∧ (B => A) */
export function eliminateBiconditional(expr) {
  return expr.replace(/\((.+?)\)\s*<=>\s*\((.+?)\)/g, "(($1 => $2) AND ($2 => $1))")
             .replace(/(\w+)\s*<=>\s*(\w+)/g, "(($1 => $2) AND ($2 => $1))")
}

/** Step 2: Eliminate implications: A => B  →  (¬A ∨ B) */
export function eliminateImplication(expr) {
  return expr.replace(/\((.+?)\)\s*=>\s*\((.+?)\)/g, "(NOT($1) OR $2)")
             .replace(/(\w+)\s*=>\s*(\w+)/g, "(NOT $1 OR $2)")
}

/** Step 3: Move NOT inward using De Morgan's Laws */
export function moveNotInward(expr) {
  // NOT(A AND B) => (NOT A OR NOT B)
  let result = expr.replace(/NOT\s*\((.+?)\s*AND\s*(.+?)\)/g, "(NOT $1 OR NOT $2)")
  // NOT(A OR B) => (NOT A AND NOT B)
  result = result.replace(/NOT\s*\((.+?)\s*OR\s*(.+?)\)/g, "(NOT $1 AND NOT $2)")
  // Double negation elimination: NOT NOT A => A
  result = result.replace(/NOT\s+NOT\s+(\w+)/g, "$1")
  return result
}

/** Step 4: Distribute OR over AND: A ∨ (B ∧ C) => (A ∨ B) ∧ (A ∨ C) */
export function distributeOrOverAnd(expr) {
  let changed = true
  let result = expr
  let iterations = 0
  while (changed && iterations < 20) {
    changed = false
    iterations++
    const prev = result
    result = result.replace(
      /\((.+?)\s+OR\s+\((.+?)\s+AND\s+(.+?)\)\)/g,
      "(($1 OR $2) AND ($1 OR $3))"
    )
    result = result.replace(
      /\(\((.+?)\s+AND\s+(.+?)\)\s+OR\s+(.+?)\)/g,
      "(($1 OR $3) AND ($2 OR $3))"
    )
    if (result !== prev) changed = true
  }
  return result
}

/** Step 5: Extract clauses from CNF expression */
export function extractClauses(expr) {
  const clauses = []
  const parts = expr.split(/\s+AND\s+/)
  for (let part of parts) {
    part = part.replace(/^\(+|\)+$/g, "").trim()
    const literals = part.split(/\s+OR\s+/).map((l) => {
      l = l.replace(/^\(+|\)+$/g, "").trim()
      if (l.startsWith("NOT ")) {
        return { negated: true, var: l.replace("NOT ", "").trim() }
      }
      return { negated: false, var: l.trim() }
    })
    if (literals.length > 0 && literals[0].var) {
      clauses.push(literals)
    }
  }
  return clauses
}

/** Full pipeline: expression string → CNF clauses */
export function toCNF(expr) {
  const steps = []
  let current = expr

  steps.push({ label: "Original", expr: current })

  current = eliminateBiconditional(current)
  steps.push({ label: "Biconditional Elimination", expr: current })

  current = eliminateImplication(current)
  steps.push({ label: "Implication Elimination", expr: current })

  current = moveNotInward(current)
  steps.push({ label: "De Morgan / Move NOT Inward", expr: current })

  current = distributeOrOverAnd(current)
  steps.push({ label: "Distribute OR over AND", expr: current })

  const clauses = extractClauses(current)
  steps.push({ label: "Clauses Extracted", expr: clauses.map(clauseToString).join(" ∧ ") })

  return { cnf: current, clauses, steps }
}

/** Convert clause array to readable string */
export function clauseToString(clause) {
  return "(" + clause.map((l) => (l.negated ? "¬" + l.var : l.var)).join(" ∨ ") + ")"
}

/** Generate CNF for Wumpus-world breeze rule: B(r,c) <=> P_adjacent */
export function breezeRule(r, c, adjacentCells) {
  const adjStr = adjacentCells.map(([ar, ac]) => `P_${ar}_${ac}`).join(" OR ")
  return `B_${r}_${c} <=> (${adjStr})`
}

/** Generate CNF for Wumpus-world stench rule: S(r,c) <=> W_adjacent */
export function stenchRule(r, c, adjacentCells) {
  const adjStr = adjacentCells.map(([ar, ac]) => `W_${ar}_${ac}`).join(" OR ")
  return `S_${r}_${c} <=> (${adjStr})`
}
