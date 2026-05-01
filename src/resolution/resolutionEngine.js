/**
 * Resolution Refutation Engine
 *
 * Given a Knowledge Base (set of clauses) and a query literal,
 * attempts to prove the query by refutation:
 *   - Negate the query
 *   - Add negation to clause set
 *   - Resolve until empty clause (contradiction) is derived → query is TRUE
 *   - Or until no new clauses → query cannot be proven
 */

import { clauseToString } from "./cnfConverter.js"

/** Negate a literal */
function negateLiteral(lit) {
  return { negated: !lit.negated, var: lit.var }
}

/** Check if two literals are complementary (one is negation of other) */
function areComplementary(l1, l2) {
  return l1.var === l2.var && l1.negated !== l2.negated
}

/** Remove duplicate literals from a clause */
function dedupe(clause) {
  const seen = new Set()
  return clause.filter((lit) => {
    const key = (lit.negated ? "¬" : "") + lit.var
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

/** Check if a clause is a tautology (contains P and ¬P) */
function isTautology(clause) {
  for (const l1 of clause) {
    for (const l2 of clause) {
      if (l1 !== l2 && l1.var === l2.var && l1.negated !== l2.negated) return true
    }
  }
  return false
}

/**
 * Resolve two clauses ci and cj.
 * Returns array of new clauses derived (may be empty []).
 * If empty clause [], that's a contradiction.
 */
export function resolveClauses(ci, cj) {
  const resolvents = []
  for (const li of ci) {
    for (const lj of cj) {
      if (areComplementary(li, lj)) {
        const newClause = dedupe([
          ...ci.filter((l) => l !== li),
          ...cj.filter((l) => l !== lj),
        ])
        if (!isTautology(newClause)) {
          resolvents.push(newClause)
        }
      }
    }
  }
  return resolvents
}

/**
 * Resolution Refutation: Prove that KB |= query
 * Returns { proved, steps, contradictionFound }
 */
export function resolution(kbClauses, queryLiteral) {
  const steps = []

  // Negate the query to add to clause set
  const negatedQuery = [negateLiteral(queryLiteral)]
  const allClauses = [...kbClauses.map((c) => [...c]), negatedQuery]

  steps.push({
    type: "init",
    message: `Query: prove ${queryLiteral.negated ? "¬" : ""}${queryLiteral.var}`,
  })
  steps.push({
    type: "negate",
    message: `Negated query added: ${clauseToString(negatedQuery)}`,
  })

  const clauseStrings = new Set(allClauses.map(clauseToString))
  let queue = [...allClauses]
  let iterations = 0
  const MAX_ITER = 200

  while (iterations < MAX_ITER) {
    iterations++
    const newClauses = []

    for (let i = 0; i < queue.length; i++) {
      for (let j = i + 1; j < queue.length; j++) {
        const resolvents = resolveClauses(queue[i], queue[j])

        for (const resolvent of resolvents) {
          const rStr = clauseToString(resolvent)

          steps.push({
            type: "resolve",
            message: `RESOLVE ${clauseToString(queue[i])} + ${clauseToString(queue[j])} → ${rStr}`,
            ci: clauseToString(queue[i]),
            cj: clauseToString(queue[j]),
            result: rStr,
          })

          // Empty clause = contradiction found
          if (resolvent.length === 0) {
            steps.push({ type: "contradiction", message: "CONTRADICTION: Empty clause derived. Query PROVED." })
            return { proved: true, steps, contradictionFound: true }
          }

          if (!clauseStrings.has(rStr)) {
            clauseStrings.add(rStr)
            newClauses.push(resolvent)
          }
        }
      }
    }

    if (newClauses.length === 0) {
      steps.push({ type: "fail", message: "No new clauses. Query CANNOT be proved from KB." })
      return { proved: false, steps, contradictionFound: false }
    }

    queue = [...queue, ...newClauses]
  }

  steps.push({ type: "timeout", message: "Resolution timeout. Result inconclusive." })
  return { proved: false, steps, contradictionFound: false }
}

/**
 * Build KB clauses from known safe/dangerous propositions.
 * This is the interface between the KB string facts and the resolution engine.
 */
export function buildKBClauses(kbFacts) {
  const clauses = []
  for (const fact of kbFacts) {
    if (fact.startsWith("¬")) {
      clauses.push([{ negated: true, var: fact.slice(1) }])
    } else {
      clauses.push([{ negated: false, var: fact }])
    }
  }
  return clauses
}

/**
 * Ask whether a cell is provably safe using resolution.
 */
export function provesSafe(kbFacts, r, c) {
  const kbClauses = buildKBClauses(kbFacts)
  const query = { negated: false, var: `Safe_${r}_${c}` }
  return resolution(kbClauses, query)
}

/**
 * Ask whether a cell provably has a pit.
 */
export function provesPit(kbFacts, r, c) {
  const kbClauses = buildKBClauses(kbFacts)
  const query = { negated: false, var: `P_${r}_${c}` }
  return resolution(kbClauses, query)
}
