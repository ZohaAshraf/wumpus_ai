# WumpusX AI — Viva Preparation

## Core Concepts

### 1. What is a Knowledge-Based Agent?
An agent with an explicit KB (propositional sentences). Uses TELL to add percepts, ASK to query for actions. Separates knowledge from inference mechanism.

### 2. Propositional Logic in Wumpus World
- Variables: B_r_c (breeze), S_r_c (stench), P_r_c (pit), W_r_c (wumpus)
- Rules encoded as biconditionals: B(r,c) ↔ adjacent pits
- Percepts convert to KB facts

### 3. CNF Conversion — 4 Steps
1. Biconditional elimination: A↔B → (A→B)∧(B→A)
2. Implication elimination: A→B → ¬A∨B
3. De Morgan's / move NOT inward
4. Distribute OR over AND

### 4. Resolution Rule
From clauses (A∨B) and (¬A∨C), resolve to get (B∨C).
If result is empty clause → contradiction.

### 5. Refutation Completeness
Resolution is refutation-complete: if KB|=α, then KB∧¬α is unsatisfiable, and resolution will derive the empty clause.

### 6. Agent Strategy
Safe queue → Resolution prover → Risk heuristic fallback

### 7. Complexity
Resolution is NP-complete in general. For Wumpus World, KB stays small enough for tractable inference.

## Possible Questions

Q: Why CNF and not other normal forms?
A: Resolution rule works directly on CNF clauses. DNF resolution is not sound.

Q: Can the agent always find the gold?
A: Not guaranteed. If all unvisited cells are provably dangerous, agent stops. In practice it uses a risk heuristic to explore.

Q: What is forward chaining?
A: Repeatedly apply modus ponens to derive new facts until no new facts can be inferred.

Q: Difference between model checking and resolution?
A: Model checking enumerates all models (2^n). Resolution is polynomial per step, complete for refutation.

Q: What percepts does the agent use?
A: Breeze, Stench, Glitter. Bump and Scream also possible but not implemented here.

Q: What is the scoring?
A: +1000 grab gold, -1000 fall in pit or eaten, -1 per step.
