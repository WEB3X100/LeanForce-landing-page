"use client"

// Ink-orbit features, retargeted for LeanForce. The bento keeps the live
// diagrams: a flow into a record, a tool hub, and a scrubbable sequence.
// React is the only import. No stock photos and no invented metrics.

import React from "react"

export type InkFeatureCopy = { title: string; description: string; repos?: string[] }
export type InkFeatures = {
  tag: string
  /** `*word*` sets a word in the muted tone; a newline breaks the line. */
  title: string
  lede?: string
  collaboration: InkFeatureCopy
  reports: InkFeatureCopy
  integrations: InkFeatureCopy & { tools: string[] }
  insights: InkFeatureCopy & { values: number[]; forecastFrom: number; stages?: string[]; marker?: string }
}

export type InkOrbitFeaturesProps = {
  /** `auto` follows prefers-color-scheme. */
  theme?: "light" | "dark" | "auto"
  /** Shown on the hub chip in the flow diagram (first word, uppercased). */
  brand?: string
  tag?: string
  title?: string
  lede?: string
  headingId?: string
  collaboration?: { [K in keyof InkFeatureCopy]?: InkFeatureCopy[K] }
  reports?: { [K in keyof InkFeatureCopy]?: InkFeatureCopy[K] }
  integrations?: { [K in keyof InkFeatures["integrations"]]?: InkFeatures["integrations"][K] }
  insights?: { [K in keyof InkFeatures["insights"]]?: InkFeatures["insights"][K] }
  className?: string
  style?: React.CSSProperties
}

function clamp(v: number, a: number, b: number): number {
  return Math.min(b, Math.max(a, v))
}

function chartPaths(values: number[], w: number, h: number, pad: number) {
  const n = values.length
  const lo = Math.min(...values)
  const hi = Math.max(...values)
  const span = hi - lo || 1
  const pts = values.map((v, i) => [
    pad + (n < 2 ? 0 : (i / (n - 1)) * (w - pad * 2)),
    h - pad - ((v - lo) / span) * (h - pad * 2),
  ] as [number, number])
  let line = ""
  pts.forEach(([x, y], i) => {
    if (i === 0) {
      line = "M" + x.toFixed(1) + "," + y.toFixed(1)
      return
    }
    const [px, py] = pts[i - 1]
    const cx = (px + x) / 2
    line += " C" + cx.toFixed(1) + "," + py.toFixed(1) + " " + cx.toFixed(1) + "," + y.toFixed(1) + " " + x.toFixed(1) + "," + y.toFixed(1)
  })
  const area = n ? line + " L" + pts[n - 1][0].toFixed(1) + "," + (h - pad) + " L" + pts[0][0].toFixed(1) + "," + (h - pad) + " Z" : ""
  return { line, area, points: pts }
}

function nearestIndex(xs: number[], x: number): number {
  let best = 0
  for (let i = 1; i < xs.length; i++) if (Math.abs(xs[i] - x) < Math.abs(xs[best] - x)) best = i
  return best
}

function parseTitle(s: string): { text: string; muted: boolean }[][] {
  return s.split(/\n|\\n/).map((line) => {
    const out: { text: string; muted: boolean }[] = []
    line.split("*").forEach((text, i) => {
      if (text) out.push({ text, muted: i % 2 === 1 })
    })
    return out
  })
}

const D_FEATURES: InkFeatures = {
  tag: "Three bundles",
  title: "One operating layer.\n*A person still decides.*",
  lede: "Distribution, production, and security. Each bundle stops for a person. These are scoped products, not a live system or a promised result.",
  collaboration: {
    title: "Distribution · Capture & Qualify",
    description: "Leads leak. The first response takes hours, and follow-up is manual and inconsistent. LeanForce routes and qualifies each inquiry, then records consent and disposition in the CRM.",
    repos: ["Twenty", "Comp AI CRM", "n8n", "Activepieces", "Chatwoot", "cal.diy", "Composio"],
  },
  reports: {
    title: "First gate",
    description: "Prototype in an isolated environment with test credentials. Sandbox before any CRM write. A person approves outreach or booking.",
  },
  integrations: {
    title: "Production · Fulfillment OS",
    description: "Intake is chaotic, rework piles up, and exceptions age in inboxes. The work becomes one packet: required fields checked, documents extracted, exceptions queued, and a person accepts it. Nothing is committed or closed on its own.",
    tools: ["MarkItDown", "ToolJet", "n8n", "RAGFlow"],
  },
  insights: {
    title: "Security · Identity & posture",
    description: "Inconsistent MFA, unmanaged credentials, unknown assets, and weak endpoint visibility. Start with a read-only inventory and a consented configuration audit, then a prioritized plan and a recurring posture report. No identity change, blocking rule, or endpoint agent without authorized change control.",
    values: [5, 6, 4, 7, 5, 6, 4, 5],
    forecastFrom: 6,
    stages: ["Inventory", "MFA", "Credentials", "Assets", "Endpoints", "Plan", "Owner", "Report"],
    marker: "OWNER",
    repos: ["Keycloak", "Wazuh", "Trivy", "OpenBao", "CrowdSec"],
  },
}

const GATES = ["Capture the inquiry", "Record consent", "Person approves"]
const CHANNELS = [
  { x: 58, y: 38, name: "Email inquiry", short: "Mail" },
  { x: 104, y: 22, name: "Web form", short: "Form" },
  { x: 150, y: 40, name: "Phone call", short: "Call" },
  { x: 46, y: 92, name: "Chat message", short: "Chat" },
  { x: 146, y: 114, name: "Booking request", short: "Book" },
]

export default function InkOrbitFeatures({
  theme = "auto",
  brand = "LeanForce",
  tag = D_FEATURES.tag,
  title = D_FEATURES.title,
  lede = D_FEATURES.lede,
  headingId,
  collaboration,
  reports,
  integrations,
  insights,
  className = "",
  style,
}: InkOrbitFeaturesProps) {
  const uid = "ib" + React.useId().replace(/[^a-zA-Z0-9]/g, "")
  const F: InkFeatures = {
    tag,
    title,
    lede,
    collaboration: { ...D_FEATURES.collaboration, ...collaboration },
    reports: { ...D_FEATURES.reports, ...reports },
    integrations: { ...D_FEATURES.integrations, ...integrations },
    insights: { ...D_FEATURES.insights, ...insights },
  }

  const [dark, setDark] = React.useState(theme === "dark")
  const [reduced, setReduced] = React.useState(false)
  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      setDark(theme === "dark")
      return
    }
    const scheme = window.matchMedia("(prefers-color-scheme: dark)")
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => {
      setDark(theme === "auto" ? scheme.matches : theme === "dark")
      setReduced(motion.matches)
    }
    sync()
    scheme.addEventListener?.("change", sync)
    motion.addEventListener?.("change", sync)
    return () => {
      scheme.removeEventListener?.("change", sync)
      motion.removeEventListener?.("change", sync)
    }
  }, [theme])

  const [featRef, featIn] = useInView(0.12)

  return (
    <div className={"ib-root " + className} data-theme={dark ? "dark" : "light"} style={style}>
      <style>{IB_CSS}</style>
      <div className="ib-shell">
        <section className="ib-sec" aria-labelledby={headingId || uid + "feat"}>
          <div className="ib-reveal" ref={featRef as never} data-in={featIn}>
            <div className="ib-head">
              {F.tag && <span className="ib-tag">{F.tag}</span>}
              <Title text={F.title} id={headingId || uid + "feat"} />
              {F.lede && <p className="ib-lede">{F.lede}</p>}
            </div>
            <div className="ib-bento">
              <FlowCard brand={brand} features={F} uid={uid} reduced={reduced} inView={featIn} />
              <IntegrationsCard copy={F.integrations} reduced={reduced} />
              <InsightsCard copy={F.insights} uid={uid} reduced={reduced} />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function useInView(threshold = 0.2) {
  const ref = React.useRef(null as HTMLElement | null)
  const [inView, setInView] = React.useState(false)
  React.useEffect(() => {
    const el = ref.current
    if (!el || inView) return
    if (typeof IntersectionObserver !== "function") {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [inView, threshold])
  return [ref, inView] as const
}

function Brackets() {
  return (
    <>
      <span className="ib-c ib-c-tl" aria-hidden="true" />
      <span className="ib-c ib-c-tr" aria-hidden="true" />
      <span className="ib-c ib-c-bl" aria-hidden="true" />
      <span className="ib-c ib-c-br" aria-hidden="true" />
    </>
  )
}

function Title({ text, className = "ib-h2", as = "h2", id }: { text: string; className?: string; as?: "h2" | "h3"; id?: string }) {
  const Tag = as
  return (
    <Tag className={className} id={id}>
      {parseTitle(text).map((line, i) => (
        <span key={i}>
          {line.map((run, j) => (
            <React.Fragment key={j}>{run.muted ? <span className="ib-muted" style={{ display: "inline" }}>{run.text}</span> : run.text}</React.Fragment>
          ))}
        </span>
      ))}
    </Tag>
  )
}

function Mark({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 5h7.2L14 12l-3.8 7H3l3.8-7z" fill="currentColor" />
      <path d="M11 5h7.2L22 12l-3.8 7H11l3.8-7z" fill="currentColor" opacity=".55" />
    </svg>
  )
}

function Repos({ items, label }: { items?: string[]; label: string }) {
  if (!items?.length) return null
  return (
    <ul className="ib-repos" aria-label={label}>
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  )
}

function ToolGlyph({ index }: { index: number }) {
  const k = index % 4
  return (
    <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      {k === 0 && (
        <>
          <rect x="-6" y="-6" width="12" height="12" rx="1.5" />
          <path d="M-6 -2h12M-6 2h12M-1.5 -6v12" />
        </>
      )}
      {k === 1 && <path d="M-6.5 4 -2 -5h4l4.5 9zm2.4 0h9.2M-2 -5l4.5 9" />}
      {k === 2 && (
        <>
          <path d="M-4.5 -6.5h6l3 3v10h-9z" />
          <path d="M-2 0h4.5M-2 3h4.5" />
        </>
      )}
      {k === 3 && (
        <>
          <circle cx="-1" cy="-1" r="4.5" />
          <path d="M2.4 2.4 6 6" />
        </>
      )}
    </g>
  )
}

function FlowCard({ brand, features, uid, reduced, inView }: { brand: string; features: InkFeatures; uid: string; reduced: boolean; inView: boolean }) {
  const [step, setStep] = React.useState(0)
  const [side, setSide] = React.useState("" as "" | "left" | "right")
  React.useEffect(() => {
    if (reduced || !inView) return
    const t = setInterval(() => setStep((n) => (n + 1) % GATES.length), 2800)
    return () => clearInterval(t)
  }, [reduced, inView])
  const L1 = "M117,67 C196,67 210,100 262,100"
  const L2 = "M117,73 C186,73 206,120 262,120"
  const chip = brand.split(" ")[0].toUpperCase()
  const hubW = Math.min(156, Math.max(116, 34 + chip.length * 7.6 + 26))
  const hubRight = 262 + hubW
  const R1 = "M" + hubRight + ",100 C" + (hubRight + 28) + ",100 " + (hubRight + 40) + ",86 450,86"
  const R2 = "M" + hubRight + ",120 C" + (hubRight + 28) + ",120 " + (hubRight + 40) + ",134 450,134"
  const rays = uid + "rays"
  const glow = uid + "glow"
  const gate = GATES[step]
  return (
    <div className="ib-frame ib-frame-hover ib-wide">
      <Brackets />
      <div className="ib-card" style={{ padding: 0, overflow: "hidden" }}>
        <svg className="ib-diagram" viewBox="0 0 640 178" role="img" aria-label={"Inquiries move through " + brand + ". A person approves before outreach or a CRM write."}>
          <defs>
            <radialGradient id={glow} cx="320" cy="110" r="190" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="var(--ib-raise)" stopOpacity="1" />
              <stop offset="1" stopColor="var(--ib-raise)" stopOpacity="0" />
            </radialGradient>
            <linearGradient id={rays} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--ib-line-strong)" stopOpacity=".55" />
              <stop offset="1" stopColor="var(--ib-line-strong)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="640" height="178" fill={"url(#" + glow + ")"} />
          {[-62, -38, -14, 14, 38, 62].map((a, i) => (
            <path key={i} d={"M320,110 L" + (320 + Math.sin((a * Math.PI) / 180) * 260) + "," + (110 - Math.cos((a * Math.PI) / 180) * 260) + " L" + (320 + Math.sin(((a + 7) * Math.PI) / 180) * 260) + "," + (110 - Math.cos(((a + 7) * Math.PI) / 180) * 260) + "Z"} fill={"url(#" + rays + ")"} opacity=".5" />
          ))}

          <g onMouseEnter={() => setSide("left")} onMouseLeave={() => setSide("")}>
            <rect x="20" y="8" width="170" height="130" fill="transparent" />
            {CHANNELS.map((m, i) => (
              <line key={"l" + i} x1={m.x} y1={m.y} x2="104" y2="70" stroke="var(--ib-line-strong)" strokeDasharray="2 3" />
            ))}
            <g transform="translate(91,57)">
              <rect width="26" height="26" rx="5" className="ib-node" />
              <text x="13" y="16" textAnchor="middle" fontSize="7" fontWeight="700" fill="var(--ib-accent)" fontFamily="var(--ib-sans)">IN</text>
            </g>
            {CHANNELS.map((m, i) => (
              <g key={i} className="ib-av" tabIndex={0} role="img" aria-label={m.name}>
                <circle cx={m.x} cy={m.y} r="13" className="ib-node" />
                <text x={m.x} y={m.y + 3} textAnchor="middle" fontSize="6.5" fontWeight="700" fill="var(--ib-accent)" fontFamily="var(--ib-sans)">{m.short}</text>
                <g className="ib-av-tip" transform={"translate(" + m.x + "," + (m.y - 20) + ")"}>
                  <rect x={-m.name.length * 2.6 - 8} y="-9" width={m.name.length * 5.2 + 16} height="14" rx="2" fill="var(--ib-inv)" />
                  <text x="0" y="1" textAnchor="middle" fontSize="7.5" fill="var(--ib-inv-ink)" fontFamily="var(--ib-sans)">{m.name}</text>
                </g>
              </g>
            ))}
          </g>

          {[L1, L2].map((d, i) => (
            <path key={d} d={d} className={"ib-flow" + (side === "left" ? " ib-flow-on" : "") + (i ? " ib-dash" : "")} />
          ))}
          {[R1, R2].map((d, i) => (
            <path key={d} d={d} className={"ib-flow" + (side === "right" ? " ib-flow-on" : "") + (i ? " ib-dash" : "")} />
          ))}
          {!reduced &&
            [L1, L2, R1, R2].map((d, i) => (
              <circle key={"p" + i} r="2.2" className="ib-pkt">
                <animateMotion dur={2.2 + (i % 2) * 0.6 + "s"} begin={i * 0.35 + "s"} repeatCount="indefinite" path={d} />
              </circle>
            ))}

          <g transform="translate(262,88)">
            <rect x="-4" y="-4" width={hubW + 8} height="52" rx="8" fill="none" stroke="var(--ib-line)" className={reduced ? undefined : "ib-glow"} />
            <rect width={hubW} height="44" rx="6" className="ib-node" />
            <g transform="translate(10,14)" style={{ color: "var(--ib-accent)" }}>
              <Mark size={16} />
            </g>
            <text x="32" y="26" fontSize="8" letterSpacing="0.8" fontWeight="700" fill="var(--ib-soft)" fontFamily="var(--ib-sans)">{chip}</text>
            <path d={"M" + (hubW - 16) + " 18l4 4-4 4"} fill="none" stroke="var(--ib-muted)" strokeWidth="1.3" />
          </g>

          <g onMouseEnter={() => setSide("right")} onMouseLeave={() => setSide("")}>
            {[2, 1, 0].map((k) => (
              <g key={k === 0 ? gate : "back" + k} transform={"translate(" + (450 + k * 12) + "," + (40 - k * 10) + ")"} opacity={1 - k * 0.25}>
                <g className={"ib-sheet" + (k === 0 ? " ib-sheet-new" : "")}>
                  <rect width="148" height="108" rx="3" fill="var(--ib-raise)" stroke="var(--ib-line-strong)" />
                  {k === 0 && (
                    <>
                      <text x="10" y="16" fontSize="7" fill="var(--ib-accent)" fontFamily="var(--ib-mono)">CRM RECORD</text>
                      <text x="10" y="32" fontSize="9" fontWeight="700" fill="var(--ib-ink)" fontFamily="var(--ib-sans)">{gate}</text>
                      <path d="M10 46h86" stroke="var(--ib-line-strong)" strokeWidth="3" />
                      <path d="M10 56h70" stroke="var(--ib-line-strong)" strokeWidth="3" />
                      <text x="10" y="76" fontSize="7.5" fill="var(--ib-soft)" fontFamily="var(--ib-sans)">Consent recorded</text>
                      <text x="10" y="90" fontSize="7.5" fill="var(--ib-soft)" fontFamily="var(--ib-sans)">Disposition set</text>
                      <text x="10" y="104" fontSize="7.5" fill="var(--ib-accent)" fontFamily="var(--ib-sans)">Held for a person</text>
                    </>
                  )}
                </g>
              </g>
            ))}
          </g>
        </svg>
        <div className="ib-wide-copy">
          <div>
            <h3>{features.collaboration.title}</h3>
            <p>{features.collaboration.description}</p>
          </div>
          <div>
            <h3>{features.reports.title}</h3>
            <p>{features.reports.description}</p>
          </div>
        </div>
        <Repos items={features.collaboration.repos} label="Capture and qualify tools in scope" />
      </div>
    </div>
  )
}

function IntegrationsCard({ copy, reduced }: { copy: InkFeatures["integrations"]; reduced: boolean }) {
  const tools = copy.tools.length ? copy.tools : ["Tool"]
  const [hover, setHover] = React.useState(-1)
  const [auto, setAuto] = React.useState(0)
  const [shift, setShift] = React.useState(0)
  React.useEffect(() => {
    if (reduced || hover >= 0) return
    const t = setInterval(() => setAuto((a) => (a + 1) % 4), 1700)
    return () => clearInterval(t)
  }, [reduced, hover])
  React.useEffect(() => {
    if (reduced || hover >= 0 || tools.length <= 4) return
    const t = setInterval(() => setShift((s) => (s + 1) % tools.length), 2400)
    return () => clearInterval(t)
  }, [reduced, hover, tools.length])
  const visible = [0, 1, 2, 3].map((i) => tools[(shift + i) % tools.length])
  const on = hover >= 0 ? hover : reduced ? -1 : auto
  const tiles = [
    { x: 66, y: 34 },
    { x: 66, y: 116 },
    { x: 234, y: 34 },
    { x: 234, y: 116 },
  ]
  const path = (i: number) => {
    const t = tiles[i]
    const dir = t.x < 150 ? -1 : 1
    return "M" + (150 + dir * 17) + ",75 H" + (150 + dir * 42) + " V" + t.y + " H" + (t.x - dir * 15)
  }
  return (
    <div className="ib-frame ib-frame-hover">
      <Brackets />
      <div className="ib-card">
        <svg className="ib-diagram" viewBox="0 0 300 150" role="group" aria-label="Fulfillment tools in scope">
          {tiles.map((_, i) => (
            <path key={i} d={path(i)} className={"ib-flow" + (on === i ? " ib-flow-on" : "")} />
          ))}
          {!reduced && on >= 0 && (
            <circle key={on + "-" + shift} r="2.2" className="ib-pkt">
              <animateMotion dur="1.1s" repeatCount="indefinite" path={path(on)} />
            </circle>
          )}
          <g transform="translate(133,58)">
            <rect width="34" height="34" rx="7" className="ib-node" />
            <g transform="translate(8,8)" style={{ color: "var(--ib-accent)" }}>
              <Mark size={18} />
            </g>
          </g>
          {tiles.map((t, i) => (
            <g
              key={visible[i] + i}
              className={"ib-tool" + (on === i ? " ib-tool-on" : "")}
              tabIndex={0}
              role="img"
              aria-label={visible[i]}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(-1)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(-1)}
            >
              <rect x={t.x - 15} y={t.y - 15} width="30" height="30" rx="6" className="ib-node" />
              <g transform={"translate(" + t.x + "," + t.y + ")"} style={{ color: "var(--ib-accent)" }}>
                <ToolGlyph index={i} />
              </g>
              <text x={t.x} y={t.y + (t.y < 75 ? -21 : 28)} textAnchor="middle" fontSize="8" fill="var(--ib-soft)" fontFamily="var(--ib-sans)" opacity={on === i ? 1 : 0}>
                {visible[i]}
              </text>
            </g>
          ))}
          <text x="150" y="112" textAnchor="middle" fontSize="7" fill="var(--ib-faint)" fontFamily="var(--ib-mono)">
            {on >= 0 ? "in scope · " + visible[on].toLowerCase() : tools.length + " in scope"}
          </text>
        </svg>
        <div>
          <h3>{copy.title}</h3>
          <p>{copy.description}</p>
          <Repos items={tools} label="Fulfillment tools in scope" />
        </div>
      </div>
    </div>
  )
}

function InsightsCard({ copy, uid, reduced }: { copy: InkFeatures["insights"]; uid: string; reduced: boolean }) {
  const [ref, inView] = useInView(0.3)
  const [hover, setHover] = React.useState(-1)
  const W = 300
  const H = 130
  const vals = copy.values.length > 1 ? copy.values : [1, 2]
  const stages = copy.stages && copy.stages.length === vals.length ? copy.stages : null
  const { line, area, points } = chartPaths(vals, W, H, 14)
  const split = clamp(copy.forecastFrom, 1, vals.length - 1)
  const fill = uid + "area"
  const last = points[points.length - 1]
  const i = hover >= 0 ? hover : points.length - 1
  const p = points[i]
  const pct = Math.round(((vals[i] - vals[0]) / (vals[0] || 1)) * 100)
  const label = stages ? stages[i] : (i >= split ? "pred " : "wk " + (i + 1) + " ") + (pct >= 0 ? "+" : "") + pct + "%"
  const tipW = Math.max(64, label.length * 5.6 + 16)
  const onMove = (e: PointerSvgEv) => {
    const r = e.currentTarget.getBoundingClientRect()
    setHover(nearestIndex(points.map((q) => q[0]), ((e.clientX - r.left) / r.width) * W))
  }
  return (
    <div className="ib-frame ib-frame-hover" ref={ref as never} data-in={inView}>
      <Brackets />
      <div className="ib-card">
        <svg className="ib-diagram ib-chart" viewBox={"0 0 " + W + " " + (H + 6)} onPointerMove={onMove} onPointerLeave={() => setHover(-1)} role="img" aria-label="Security review sequence from inventory to a posture report. Not a measured result.">
          <defs>
            <linearGradient id={fill} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--ib-accent)" stopOpacity=".2" />
              <stop offset="1" stopColor="var(--ib-accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((g) => (
            <line key={g} x1="14" x2={W - 14} y1={H * g} y2={H * g} stroke="var(--ib-line)" />
          ))}
          <path d={area} fill={"url(#" + fill + ")"} />
          <path d={line} fill="none" stroke="var(--ib-accent)" strokeWidth="1.6" pathLength={1} className="ib-line-draw" />
          <line x1={points[split][0]} x2={points[split][0]} y1="10" y2={H - 14} stroke="var(--ib-line-strong)" strokeDasharray="2 3" />
          <text x={points[split][0] - 4} y={H - 18} textAnchor="end" fontSize="7" fill="var(--ib-faint)" fontFamily="var(--ib-mono)">
            {copy.marker || "FORECAST"}
          </text>
          {hover >= 0 && <line x1={p[0]} x2={p[0]} y1="8" y2={H - 14} stroke="var(--ib-accent)" strokeOpacity=".45" />}
          {!reduced && hover < 0 && <circle cx={last[0]} cy={last[1]} r="7" fill="var(--ib-accent)" opacity=".2" className="ib-glow" />}
          <circle cx={p[0]} cy={p[1]} r="3.2" fill="var(--ib-raise)" stroke="var(--ib-accent)" strokeWidth="1.5" />
          <g transform={"translate(" + clamp(p[0], tipW / 2 + 4, W - tipW / 2 - 4) + "," + (p[1] < 34 ? p[1] + 22 : p[1] - 12) + ")"}>
            <rect x={-tipW / 2} y="-11" width={tipW} height="15" rx="2" fill="var(--ib-inv)" />
            <text x="0" y="-1" textAnchor="middle" fontSize="7.5" fill="var(--ib-inv-ink)" fontFamily="var(--ib-mono)">{label}</text>
          </g>
        </svg>
        <div>
          <h3>{copy.title}</h3>
          <p>{copy.description}</p>
          <Repos items={copy.repos} label="Security tools in scope" />
        </div>
      </div>
    </div>
  )
}

const IB_CSS = `
.ib-root{--ib-page:#efefef;--ib-hatch:rgba(0,0,0,.06);--ib-paper:#fbfbfb;--ib-card:#f4f4f4;--ib-raise:#ffffff;--ib-ink:#151515;--ib-soft:#3d3d3d;--ib-muted:#5c6570;--ib-faint:#6d7680;--ib-line:#e2e2e2;--ib-line-strong:#cfcfcf;--ib-bracket:#c9c9c9;--ib-inv:#161616;--ib-inv-ink:#f5f5f5;--ib-accent:#085a68;--ib-shadow:0 1px 2px rgba(0,0,0,.05),0 8px 24px -12px rgba(0,0,0,.12);--ib-sans:"Manrope","Inter",ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;--ib-mono:"Manrope",ui-sans-serif,system-ui,sans-serif;position:relative;width:100%;box-sizing:border-box;background-color:var(--ib-page);background-image:repeating-linear-gradient(135deg,var(--ib-hatch) 0 1px,transparent 1px 10px);color:var(--ib-ink);font-family:var(--ib-sans);font-size:16px;line-height:1.5;-webkit-font-smoothing:antialiased;padding:8px clamp(10px,2.4vw,28px) 28px;transition:background-color .45s ease,color .45s ease}
.ib-root[data-theme="dark"]{--ib-page:#000;--ib-hatch:rgba(25,195,220,.07);--ib-paper:#070b10;--ib-card:#0d141c;--ib-raise:#101820;--ib-ink:#f4f7f4;--ib-soft:#d5e4ec;--ib-muted:#d5e4ec;--ib-faint:#9ec4d2;--ib-line:rgba(226,234,240,.16);--ib-line-strong:rgba(25,195,220,.45);--ib-bracket:rgba(25,195,220,.75);--ib-inv:#f4f7f4;--ib-inv-ink:#061a35;--ib-accent:#19c3dc;--ib-shadow:0 1px 2px rgba(0,0,0,.4),0 10px 30px -14px rgba(0,0,0,.7)}
.ib-root :where(*){box-sizing:border-box}
.ib-root :focus-visible{outline:2px solid var(--ib-accent);outline-offset:2px}
.ib-root :where(svg){display:block;max-width:none;flex:none}
.ib-root :where(h2,h3,p){margin:0;padding:0;font-size:inherit;font-weight:inherit}
.ib-shell{width:100%;max-width:1180px;margin:0 auto;container-type:inline-size}
.ib-sec{position:relative;background:var(--ib-paper);border:1px solid var(--ib-line);padding:clamp(36px,6cqw,72px) clamp(16px,4cqw,48px);transition:background-color .45s,border-color .45s}
.ib-reveal{opacity:0;transform:translateY(18px);transition:opacity .8s cubic-bezier(.2,.7,.2,1),transform .8s cubic-bezier(.2,.7,.2,1)}
.ib-reveal[data-in="true"]{opacity:1;transform:none}
.ib-head{display:flex;flex-direction:column;align-items:center;text-align:center;gap:14px;margin-bottom:clamp(28px,4.5cqw,52px)}
.ib-tag{display:inline-block;padding:6px 12px;font-size:13px;font-weight:650;letter-spacing:.08em;text-transform:uppercase;color:var(--ib-accent);background:transparent;border:1px solid var(--ib-line-strong)}
.ib-h2{font-size:clamp(32px,4.4cqw,48px);line-height:1.12;letter-spacing:-.03em;font-weight:650;color:var(--ib-ink)}
.ib-h2>span{display:block}
.ib-h2 .ib-muted{color:var(--ib-accent)}
.ib-lede{max-width:44rem;color:var(--ib-soft);font-size:18px;line-height:1.55}
.ib-frame{position:relative}
.ib-c{position:absolute;width:12px;height:12px;border-color:var(--ib-bracket);border-style:solid;border-width:0;pointer-events:none;transition:border-color .3s,transform .35s cubic-bezier(.2,.8,.2,1)}
.ib-c-tl{top:-6px;left:-6px;border-top-width:1.5px;border-left-width:1.5px}
.ib-c-tr{top:-6px;right:-6px;border-top-width:1.5px;border-right-width:1.5px}
.ib-c-bl{bottom:-6px;left:-6px;border-bottom-width:1.5px;border-left-width:1.5px}
.ib-c-br{bottom:-6px;right:-6px;border-bottom-width:1.5px;border-right-width:1.5px}
.ib-frame-hover:hover>.ib-c{border-color:var(--ib-accent)}
.ib-frame-hover:hover>.ib-c-tl{transform:translate(-3px,-3px)}
.ib-frame-hover:hover>.ib-c-tr{transform:translate(3px,-3px)}
.ib-frame-hover:hover>.ib-c-bl{transform:translate(-3px,3px)}
.ib-frame-hover:hover>.ib-c-br{transform:translate(3px,3px)}
.ib-bento{display:grid;grid-template-columns:minmax(0,1fr);gap:clamp(22px,3cqw,34px)}
@container (min-width:720px){.ib-bento{grid-template-columns:repeat(2,minmax(0,1fr))}.ib-wide{grid-column:1 / -1;width:min(100%,980px);justify-self:center}}
.ib-card{background:linear-gradient(180deg,var(--ib-raise),var(--ib-card));border:1px solid var(--ib-line);padding:clamp(16px,2cqw,22px);display:flex;flex-direction:column;gap:16px;transition:border-color .3s,box-shadow .35s,background-color .45s}
.ib-card:hover{border-color:var(--ib-line-strong);box-shadow:var(--ib-shadow)}
.ib-card h3{font-size:20px;font-weight:650;letter-spacing:-.02em;line-height:1.3;color:var(--ib-ink)}
.ib-card p{font-size:16px;line-height:1.55;color:var(--ib-muted);max-width:62ch}
.ib-repos{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0 0;padding:0;list-style:none}
.ib-repos li{font-size:13px;line-height:1.3;color:var(--ib-soft);border:1px solid var(--ib-line-strong);border-radius:999px;padding:6px 10px}
.ib-diagram{width:100%;height:auto;overflow:visible}
.ib-wide-copy{display:grid;grid-template-columns:1fr;gap:16px;padding:0 22px}
.ib-wide .ib-repos{padding:0 22px 20px}
@container (min-width:560px){.ib-wide-copy{grid-template-columns:1fr 1fr;gap:28px}}
.ib-flow{stroke:var(--ib-line-strong);fill:none;stroke-width:1.2;transition:stroke .3s}
.ib-flow-on{stroke:var(--ib-accent)}
.ib-dash{stroke-dasharray:3 4;animation:ib-dash 1.2s linear infinite}
.ib-pkt{fill:var(--ib-accent)}
.ib-node{fill:var(--ib-raise);stroke:var(--ib-line-strong);transition:stroke .3s}
.ib-av{cursor:pointer;transition:transform .35s cubic-bezier(.2,.8,.2,1);transform-box:fill-box;transform-origin:center}
.ib-av:hover,.ib-av:focus-visible{transform:scale(1.12)}
.ib-av-tip{opacity:0;transition:opacity .2s;pointer-events:none}
.ib-av:hover .ib-av-tip,.ib-av:focus .ib-av-tip,.ib-av:focus-visible .ib-av-tip{opacity:1}
.ib-sheet{transition:transform .7s cubic-bezier(.2,.8,.2,1),opacity .7s}
.ib-sheet-new{animation:ib-sheet-in .7s cubic-bezier(.2,.8,.2,1) both}
.ib-tool{cursor:pointer;transition:transform .3s cubic-bezier(.2,.8,.2,1);transform-box:fill-box;transform-origin:center}
.ib-tool:hover,.ib-tool-on{transform:translateY(-2px)}
.ib-tool text{transition:opacity .25s}
.ib-tool-on rect.ib-node{stroke:var(--ib-accent)}
.ib-chart{cursor:crosshair;touch-action:none}
.ib-line-draw{stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset 1.8s cubic-bezier(.4,.1,.2,1)}
[data-in="true"] .ib-line-draw{stroke-dashoffset:0}
.ib-glow{animation:ib-pulse 2s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes ib-dash{to{stroke-dashoffset:-14}}
@keyframes ib-pulse{0%,100%{opacity:1}50%{opacity:.45}}
@keyframes ib-sheet-in{from{opacity:0;transform:translate(14px,-10px)}to{opacity:1;transform:none}}
.ib-bento>.ib-frame{display:flex;flex-direction:column}
.ib-bento>.ib-frame>.ib-card{flex:1}
@media (prefers-reduced-motion:reduce){
.ib-reveal{opacity:1;transform:none;transition:none}
.ib-dash,.ib-glow,.ib-sheet-new{animation:none}
.ib-line-draw{transition:none;stroke-dashoffset:0}
}
@media (max-width:760px){
.ib-card h3{font-size:18px}
.ib-card p,.ib-lede{font-size:16px}
.ib-wide-copy,.ib-wide .ib-repos{padding-left:16px;padding-right:16px}
}
`

type PointerSvgEv = React.PointerEvent<SVGSVGElement>
