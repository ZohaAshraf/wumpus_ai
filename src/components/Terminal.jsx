import { useRef, useEffect } from "react"
import { useStore } from "../store/useStore"
import { logColor } from "../utils/helpers"

const TYPE_LABELS = {
  percept: "PERCEPT",
  cnf:     "CNF    ",
  resolve: "RESOLVE",
  safe:    "SAFE   ",
  danger:  "DANGER ",
  move:    "MOVE   ",
  gold:    "GOLD   ",
  warn:    "WARN   ",
  info:    "INFO   ",
}

export default function Terminal() {
  const logs    = useStore((s) => s.logs)
  const kbFacts = useStore((s) => s.kbFacts)
  const bottomRef = useRef(null)

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [logs])

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* AI Log */}
      <div className="neon-border rounded-xl glass flex flex-col" style={{ height: "360px" }}>
        <div className="px-4 py-2 border-b border-white/5 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-display text-gray-400 tracking-widest uppercase">AI Reasoning Terminal</span>
        </div>
        <div className="flex-1 overflow-y-auto p-3 font-mono text-[10px] leading-relaxed">
          {logs.length === 0 && (
            <span className="text-gray-600">Waiting for simulation to start...</span>
          )}
          {[...logs].reverse().map((log, i) => (
            <div key={i} className="terminal-line" style={{ color: logColor(log.type) }}>
              <span className="opacity-40 mr-2">[{TYPE_LABELS[log.type] || "INFO   "}]</span>
              {log.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* KB Facts */}
      <div className="neon-border rounded-xl glass flex flex-col" style={{ maxHeight: "220px" }}>
        <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: "#a78bfa" }} />
            <span className="text-xs font-display text-gray-400 tracking-widest uppercase">Knowledge Base</span>
          </div>
          <span className="text-xs text-gray-600">{kbFacts.length} facts</span>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <div className="flex flex-wrap gap-1">
            {kbFacts.slice(-60).map((fact, i) => (
              <span
                key={i}
                className="text-[9px] px-1.5 py-0.5 rounded font-mono"
                style={{
                  background: fact.startsWith("Safe")
                    ? "rgba(0,255,159,0.1)"
                    : fact.startsWith("¬")
                    ? "rgba(136,136,136,0.1)"
                    : "rgba(0,245,255,0.08)",
                  border: `1px solid ${
                    fact.startsWith("Safe")
                      ? "rgba(0,255,159,0.3)"
                      : fact.startsWith("¬")
                      ? "rgba(136,136,136,0.2)"
                      : "rgba(0,245,255,0.2)"
                  }`,
                  color: fact.startsWith("Safe")
                    ? "#4ade80"
                    : fact.startsWith("¬")
                    ? "#888"
                    : "#a78bfa",
                }}
              >
                {fact}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
