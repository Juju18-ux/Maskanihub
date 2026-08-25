import { useState, useMemo } from "react"

interface Props {
  onClose: () => void
  prefillPrice?: number  // KES sale price from property modal
  prefillEstate?: string
}

// Kenyan lenders — real institutions & indicative rates (Aug 2026)
const LENDERS = [
  {
    name: "KMRC-Backed Loans",
    logo: "🏛️",
    rate: 9.5,
    maxTerm: 25,
    maxLtv: 90,
    badge: "Gov't Backed",
    badgeColor: "#1B5E35",
    desc: "Kenya Mortgage Refinance Company subsidised rates through partner banks. Lowest market rate for eligible buyers.",
    partnerBanks: ["KCB", "Co-op Bank", "HFC", "Stanbic"],
    highlight: true,
  },
  {
    name: "KCB Bank Kenya",
    logo: "🔵",
    rate: 13.0,
    maxTerm: 25,
    maxLtv: 85,
    badge: null,
    badgeColor: "",
    desc: "KCB Home Loan — Kenya's largest bank. Flexible repayment up to 25 years. Can be combined with KMRC.",
    partnerBanks: [],
    highlight: false,
  },
  {
    name: "Equity Bank",
    logo: "🟠",
    rate: 13.5,
    maxTerm: 20,
    maxLtv: 80,
    badge: null,
    badgeColor: "",
    desc: "Equity Nyumbani mortgage. Fast approvals, accepts informal income documentation.",
    partnerBanks: [],
    highlight: false,
  },
  {
    name: "NCBA Bank",
    logo: "⚫",
    rate: 12.5,
    maxTerm: 25,
    maxLtv: 85,
    badge: "Competitive",
    badgeColor: "#B84520",
    desc: "CBA Heritage Mortgage — strong rates, full digital application. Joint applications accepted.",
    partnerBanks: [],
    highlight: false,
  },
  {
    name: "Co-operative Bank",
    logo: "🟢",
    rate: 12.8,
    maxTerm: 20,
    maxLtv: 80,
    badge: null,
    badgeColor: "",
    desc: "Co-op Maisha mortgage. SACCO-member preferential pricing available. Diaspora-friendly.",
    partnerBanks: [],
    highlight: false,
  },
  {
    name: "SACCO Mortgage",
    logo: "🤝",
    rate: 10.5,
    maxTerm: 20,
    maxLtv: 85,
    badge: "Member Benefit",
    badgeColor: "#C8891A",
    desc: "Mwalimu, STIMA, Kenya Police, or employer SACCOs. Lower rates for members. Requires 6-month membership.",
    partnerBanks: ["Mwalimu SACCO", "STIMA SACCO", "Afya SACCO"],
    highlight: false,
  },
  {
    name: "Absa Kenya",
    logo: "🔴",
    rate: 13.2,
    maxTerm: 20,
    maxLtv: 80,
    badge: null,
    badgeColor: "",
    desc: "Absa Home Loan. USD-denominated option available for diaspora buyers. Branches in all major cities.",
    partnerBanks: [],
    highlight: false,
  },
  {
    name: "HF Group (HFC)",
    logo: "🏠",
    rate: 13.5,
    maxTerm: 25,
    maxLtv: 90,
    badge: "Housing Specialist",
    badgeColor: "#1B5E35",
    desc: "Kenya's dedicated mortgage lender since 1965. Highest LTV available. Construction loans offered.",
    partnerBanks: [],
    highlight: false,
  },
]

function formatKES(n: number, decimals = 0) {
  if (n >= 1_000_000) return `KES ${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1000)      return `KES ${(n / 1000).toFixed(decimals)}k`
  return `KES ${n.toFixed(0)}`
}

function calcMonthly(principal: number, annualRate: number, years: number) {
  const r = annualRate / 100 / 12
  const n = years * 12
  if (r === 0) return principal / n
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

type Tab = "calculator" | "lenders" | "costs"

export default function MortgageCalculator({ onClose, prefillPrice, prefillEstate }: Props) {
  const [tab, setTab] = useState<Tab>("calculator")

  // Calculator state
  const [priceStr, setPriceStr] = useState(
    prefillPrice ? String(prefillPrice) : "8000000"
  )
  const [downPct, setDownPct] = useState(20)
  const [termYrs, setTermYrs] = useState(20)
  const [selectedLenderIdx, setSelectedLenderIdx] = useState(0)
  const [isUrban, setIsUrban] = useState(true)

  const price    = parseFloat(priceStr.replace(/,/g, "")) || 0
  const lender   = LENDERS[selectedLenderIdx]
  const downAmt  = price * downPct / 100
  const loanAmt  = price - downAmt
  const monthly  = calcMonthly(loanAmt, lender.rate, termYrs)
  const totalPay = monthly * termYrs * 12
  const totalInt = totalPay - loanAmt

  // Buying costs
  const costs = useMemo(() => {
    const stampDuty    = price * (isUrban ? 0.04 : 0.02)
    const legalFees    = Math.max(price * 0.01, 15000)
    const valuation    = price * 0.0025
    const agentFee     = price * 0.03
    const loanOrigination = loanAmt * 0.015
    const titleSearch  = 5000
    const landRent     = 3000
    return {
      stampDuty, legalFees, valuation, agentFee,
      loanOrigination, titleSearch, landRent,
      total: stampDuty + legalFees + valuation + agentFee + loanOrigination + titleSearch + landRent,
    }
  }, [price, isUrban, loanAmt])

  const pctBar = (val: number, max: number) => `${Math.min(100, (val / max) * 100).toFixed(1)}%`

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-6 px-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="relative w-full rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: "#FFFFFF", fontFamily: "Outfit, sans-serif", maxWidth: 720 }}
      >
        {/* ── Header ── */}
        <div
          className="px-8 pt-9 pb-7 relative"
          style={{ background: "linear-gradient(135deg, #0F2419 0%, #1B5E35 60%, #2D6B4F 100%)" }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.12)", color: "#fff" }}
          >
            ✕
          </button>

          {prefillEstate && (
            <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", marginBottom: 6, textTransform: "uppercase" }}>
              Financing for · {prefillEstate}
            </div>
          )}

          <div className="flex items-end gap-3 mb-2">
            <div style={{ fontSize: "1.9rem" }}>🏡</div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>
                Kenyan Property Finance
              </div>
              <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "clamp(1.5rem,4vw,2rem)", color: "#fff", fontWeight: 300, lineHeight: 1.1 }}>
                Mortgage &amp; Asset Financing
              </h2>
            </div>
          </div>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.85rem", lineHeight: 1.6, marginTop: 6 }}>
            Compare real Kenyan lenders, calculate monthly repayments, and understand total buying costs — all in KES.
          </p>

          {/* Tabs */}
          <div className="flex gap-1 mt-6">
            {([
              { id: "calculator", label: "Calculator" },
              { id: "lenders",    label: "Lenders" },
              { id: "costs",      label: "Buying Costs" },
            ] as { id: Tab; label: string }[]).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: tab === t.id ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.06)",
                  color: tab === t.id ? "#fff" : "rgba(255,255,255,0.5)",
                  border: tab === t.id ? "1px solid rgba(255,255,255,0.22)" : "1px solid transparent",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Calculator Tab ── */}
        {tab === "calculator" && (
          <div className="p-8 space-y-7">

            {/* Property price */}
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151", letterSpacing: "0.04em" }}>
                Property Price (KES)
              </label>
              <div className="relative mt-2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold" style={{ color: "#6B7280" }}>KES</span>
                <input
                  type="number"
                  value={priceStr}
                  onChange={(e) => setPriceStr(e.target.value)}
                  className="w-full rounded-xl pl-12 pr-4 py-3 text-sm font-semibold"
                  style={{ background: "#F7F5F1", border: "1.5px solid #E8E0D5", color: "#1A1A1A", outline: "none" }}
                  placeholder="8000000"
                />
              </div>
              {price > 0 && (
                <div style={{ fontSize: "0.75rem", color: "#9CA3AF", marginTop: 5 }}>
                  ≈ {formatKES(price)} &nbsp;·&nbsp; ~USD {(price / 130).toLocaleString("en", { maximumFractionDigits: 0 })}
                </div>
              )}
            </div>

            {/* Down payment */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151", letterSpacing: "0.04em" }}>
                  Down Payment
                </label>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: "1rem", fontWeight: 700, color: "#B84520" }}>{downPct}%</span>
                  <span style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>= {formatKES(downAmt)}</span>
                </div>
              </div>
              <input type="range" min={10} max={60} step={5} value={downPct} onChange={(e) => setDownPct(Number(e.target.value))}
                className="w-full accent-[#B84520]" style={{ accentColor: "#B84520" }} />
              <div className="flex justify-between mt-1">
                <span style={{ fontSize: "0.68rem", color: "#9CA3AF" }}>10% (min)</span>
                <span style={{ fontSize: "0.68rem", color: "#9CA3AF" }}>60%</span>
              </div>
              <div
                className="mt-3 rounded-xl p-3 flex items-center gap-3"
                style={{ background: "#FBF0EC", border: "1px solid rgba(184,69,32,0.15)" }}
              >
                <span style={{ fontSize: "1.1rem" }}>💡</span>
                <div style={{ fontSize: "0.76rem", color: "#6B7280", lineHeight: 1.55 }}>
                  {downPct < 20
                    ? "Below 20% down — most lenders require mortgage insurance (≈0.3% p.a.)."
                    : downPct >= 30
                    ? "Strong equity position — you may qualify for preferential rates."
                    : "Solid down payment. Most lenders will pre-approve at this level."}
                </div>
              </div>
            </div>

            {/* Lender selector */}
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151", letterSpacing: "0.04em", display: "block", marginBottom: 8 }}>
                Choose Lender
              </label>
              <div className="grid grid-cols-2 gap-2">
                {LENDERS.map((l, i) => (
                  <button
                    key={l.name}
                    onClick={() => setSelectedLenderIdx(i)}
                    className="text-left rounded-xl px-3 py-2.5 transition-all"
                    style={{
                      background: selectedLenderIdx === i ? (l.highlight ? "rgba(27,94,53,0.08)" : "rgba(184,69,32,0.07)") : "#F7F5F1",
                      border: selectedLenderIdx === i ? `1.5px solid ${l.highlight ? "#1B5E35" : "#B84520"}` : "1.5px solid #E8E0D5",
                    }}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span style={{ fontSize: "0.9rem" }}>{l.logo}</span>
                      <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#1A1A1A" }}>{l.name}</span>
                    </div>
                    <div style={{ fontSize: "0.8rem", fontWeight: 700, color: l.highlight ? "#1B5E35" : "#B84520" }}>
                      {l.rate}% p.a.
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Loan term */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151", letterSpacing: "0.04em" }}>
                  Loan Term
                </label>
                <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1B5E35" }}>{termYrs} years</span>
              </div>
              <div className="flex gap-2">
                {[5, 10, 15, 20, 25].filter(y => y <= lender.maxTerm).map((y) => (
                  <button
                    key={y}
                    onClick={() => setTermYrs(y)}
                    className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                    style={{
                      background: termYrs === y ? "#1B5E35" : "#F7F5F1",
                      color: termYrs === y ? "#fff" : "#6B7280",
                      border: termYrs === y ? "none" : "1px solid #E8E0D5",
                    }}
                  >
                    {y}yr
                  </button>
                ))}
              </div>
            </div>

            {/* Results card */}
            {price > 0 && loanAmt > 0 && (
              <div
                className="rounded-2xl overflow-hidden"
                style={{ border: "1.5px solid #E8E0D5" }}
              >
                {/* Top: monthly payment */}
                <div
                  className="px-6 py-5 text-center"
                  style={{ background: "linear-gradient(135deg, #0F2419 0%, #1B5E35 100%)" }}
                >
                  <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 6 }}>
                    Estimated Monthly Repayment
                  </div>
                  <div style={{ fontFamily: "Fraunces, serif", fontSize: "clamp(2rem,5vw,2.8rem)", color: "#fff", fontWeight: 300, letterSpacing: "-0.01em" }}>
                    {formatKES(monthly, 0)}<span style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.5)", marginLeft: 6 }}>/mo</span>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginTop: 4 }}>
                    via {lender.name} · {lender.rate}% p.a. · {termYrs} years
                  </div>
                </div>

                {/* Breakdown grid */}
                <div className="grid grid-cols-3 divide-x" style={{ borderTop: "1px solid #E8E0D5", borderColor: "#E8E0D5" }}>
                  {[
                    { label: "Loan Amount",    val: formatKES(loanAmt),  color: "#1A1A1A" },
                    { label: "Total Interest", val: formatKES(totalInt), color: "#B84520" },
                    { label: "Total Cost",     val: formatKES(totalPay), color: "#C8891A" },
                  ].map((s) => (
                    <div key={s.label} className="py-4 text-center" style={{ borderColor: "#E8E0D5" }}>
                      <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.05rem", color: s.color, fontWeight: 400 }}>{s.val}</div>
                      <div style={{ fontSize: "0.68rem", color: "#9CA3AF", marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Interest proportion bar */}
                <div className="px-6 py-4" style={{ borderTop: "1px solid #E8E0D5" }}>
                  <div style={{ fontSize: "0.72rem", color: "#9CA3AF", marginBottom: 6 }}>
                    Cost breakdown
                  </div>
                  <div className="flex rounded-full overflow-hidden" style={{ height: 8 }}>
                    <div style={{ width: pctBar(loanAmt, totalPay), background: "#1B5E35" }} title={`Principal: ${formatKES(loanAmt)}`} />
                    <div style={{ width: pctBar(totalInt, totalPay), background: "#B84520" }} title={`Interest: ${formatKES(totalInt)}`} />
                  </div>
                  <div className="flex gap-4 mt-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ background: "#1B5E35" }} />
                      <span style={{ fontSize: "0.68rem", color: "#6B7280" }}>Principal ({((loanAmt / totalPay) * 100).toFixed(0)}%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ background: "#B84520" }} />
                      <span style={{ fontSize: "0.68rem", color: "#6B7280" }}>Interest ({((totalInt / totalPay) * 100).toFixed(0)}%)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div style={{ fontSize: "0.7rem", color: "#9CA3AF", lineHeight: 1.6 }}>
              ⚠️ Indicative only. Actual rates depend on your credit profile, income, and bank assessment. Contact a lender or Bell Listings advisors for a formal pre-approval.
            </div>
          </div>
        )}

        {/* ── Lenders Tab ── */}
        {tab === "lenders" && (
          <div className="p-8 space-y-4">
            <div style={{ fontSize: "0.82rem", color: "#6B7280", lineHeight: 1.65, marginBottom: 4 }}>
              All rates are indicative as at August 2026. Actual rates vary by applicant profile. KMRC-backed rates are lowest but require income verification through a partner bank.
            </div>

            {LENDERS.map((l, i) => (
              <div
                key={l.name}
                className="rounded-2xl p-5"
                style={{
                  border: l.highlight ? "1.5px solid rgba(27,94,53,0.3)" : "1px solid #E8E0D5",
                  background: l.highlight ? "rgba(27,94,53,0.03)" : "#FAFAF9",
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: "#F7F5F1" }}
                    >
                      {l.logo}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "#1A1A1A" }}>{l.name}</span>
                        {l.badge && (
                          <span
                            className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                            style={{ background: `${l.badgeColor}18`, color: l.badgeColor, border: `1px solid ${l.badgeColor}30` }}
                          >
                            {l.badge}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "#6B7280", marginTop: 2 }}>{l.desc}</div>
                      {l.partnerBanks.length > 0 && (
                        <div style={{ fontSize: "0.72rem", color: "#9CA3AF", marginTop: 4 }}>
                          via: {l.partnerBanks.join(" · ")}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.4rem", color: l.highlight ? "#1B5E35" : "#B84520", fontWeight: 300, lineHeight: 1 }}>
                      {l.rate}%
                    </div>
                    <div style={{ fontSize: "0.65rem", color: "#9CA3AF", marginTop: 2 }}>per annum</div>
                  </div>
                </div>

                <div className="flex gap-4 mt-4 pt-4" style={{ borderTop: "1px solid #E8E0D5" }}>
                  <div>
                    <div style={{ fontSize: "0.65rem", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em" }}>Max LTV</div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#374151", marginTop: 2 }}>{l.maxLtv}%</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.65rem", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em" }}>Max Term</div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#374151", marginTop: 2 }}>{l.maxTerm} yrs</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.65rem", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em" }}>Min Down</div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#374151", marginTop: 2 }}>{100 - l.maxLtv}%</div>
                  </div>
                  <div className="ml-auto">
                    <button
                      onClick={() => { setSelectedLenderIdx(i); setTab("calculator") }}
                      className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
                      style={{ background: l.highlight ? "#1B5E35" : "#B84520", color: "#fff" }}
                    >
                      Calculate →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Buying Costs Tab ── */}
        {tab === "costs" && (
          <div className="p-8 space-y-6">

            {/* Price input for this tab */}
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151", letterSpacing: "0.04em" }}>
                Property Price (KES)
              </label>
              <div className="relative mt-2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold" style={{ color: "#6B7280" }}>KES</span>
                <input
                  type="number"
                  value={priceStr}
                  onChange={(e) => setPriceStr(e.target.value)}
                  className="w-full rounded-xl pl-12 pr-4 py-3 text-sm font-semibold"
                  style={{ background: "#F7F5F1", border: "1.5px solid #E8E0D5", color: "#1A1A1A", outline: "none" }}
                  placeholder="8000000"
                />
              </div>
            </div>

            {/* Urban/Rural toggle */}
            <div className="flex items-center gap-3">
              <span style={{ fontSize: "0.8rem", color: "#6B7280" }}>Location:</span>
              <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid #E8E0D5" }}>
                {[{ label: "Urban (4% stamp)", val: true }, { label: "Rural (2% stamp)", val: false }].map((o) => (
                  <button
                    key={String(o.val)}
                    onClick={() => setIsUrban(o.val)}
                    className="px-4 py-2 text-sm font-medium transition-all"
                    style={{ background: isUrban === o.val ? "#1B5E35" : "#F7F5F1", color: isUrban === o.val ? "#fff" : "#6B7280" }}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cost breakdown */}
            {price > 0 && (
              <>
                <div className="space-y-2">
                  {[
                    { label: "Stamp Duty",         val: costs.stampDuty,        desc: isUrban ? "4% of purchase price (urban)" : "2% of purchase price (rural)", color: "#B84520" },
                    { label: "Legal / Conveyancing",val: costs.legalFees,        desc: "~1% of purchase price (min KES 15,000)", color: "#6B7280" },
                    { label: "Property Valuation",  val: costs.valuation,        desc: "0.25% of purchase price — required by lender", color: "#6B7280" },
                    { label: "Agent / Broker Fee",  val: costs.agentFee,         desc: "~3% of purchase price (negotiable)", color: "#6B7280" },
                    { label: "Loan Origination",    val: costs.loanOrigination,  desc: "~1.5% of loan amount — bank processing", color: "#6B7280" },
                    { label: "Title Search",        val: costs.titleSearch,      desc: "Flat fee at Lands Registry", color: "#6B7280" },
                    { label: "Annual Land Rent",    val: costs.landRent,         desc: "Approx first-year land rent (leasehold)", color: "#6B7280" },
                  ].map((c) => (
                    <div key={c.label} className="flex items-center gap-4 rounded-xl px-4 py-3" style={{ background: "#F7F5F1", border: "1px solid #E8E0D5" }}>
                      <div className="flex-1">
                        <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1A1A1A" }}>{c.label}</div>
                        <div style={{ fontSize: "0.72rem", color: "#9CA3AF", marginTop: 1 }}>{c.desc}</div>
                      </div>
                      <div style={{ fontFamily: "Fraunces, serif", fontSize: "1rem", color: c.color, fontWeight: 400, flexShrink: 0 }}>
                        {formatKES(c.val)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div
                  className="rounded-2xl px-6 py-5 flex items-center justify-between"
                  style={{ background: "linear-gradient(135deg, #0F2419, #1B5E35)" }}
                >
                  <div>
                    <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.12em" }}>Total Transaction Costs</div>
                    <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", marginTop: 3 }}>
                      In addition to {formatKES(price)} purchase price
                    </div>
                  </div>
                  <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.8rem", color: "#fff", fontWeight: 300 }}>
                    {formatKES(costs.total)}
                  </div>
                </div>

                <div className="rounded-xl p-4" style={{ background: "#FFF8EE", border: "1px solid rgba(200,137,26,0.2)" }}>
                  <div style={{ fontSize: "0.77rem", color: "#6B7280", lineHeight: 1.65 }}>
                    💰 <strong style={{ color: "#C8891A" }}>Total cash needed at closing:</strong>{" "}
                    {formatKES(downAmt + costs.total)} — your {downPct}% down ({formatKES(downAmt)}) plus transaction costs ({formatKES(costs.total)}).
                  </div>
                </div>

                {/* Key Kenyan buying notes */}
                <div>
                  <div style={{ fontFamily: "Fraunces, serif", fontSize: "1rem", color: "#1A1A1A", marginBottom: 10 }}>
                    Things to know when buying in Kenya
                  </div>
                  <div className="space-y-2">
                    {[
                      { icon: "📋", tip: "All property transactions must go through a licensed advocate. Budget KES 15k–50k for conveyancing." },
                      { icon: "🏛️", tip: "Stamp duty is paid to KRA via iTax before title transfer. Must be paid within 30 days of signing." },
                      { icon: "📍", tip: "Conduct a land search at Ardhisasa (Nairobi) or the county lands office to verify ownership before any payment." },
                      { icon: "🌍", tip: "Diaspora buyers can use a Power of Attorney and open a KES account remotely through most major banks." },
                      { icon: "🔒", tip: "Avoid paying more than 10% deposit before signing a sale agreement. Always use an escrow or lawyer's client account." },
                    ].map((n) => (
                      <div key={n.tip} className="flex gap-3 rounded-xl px-4 py-3" style={{ background: "#F7F5F1" }}>
                        <span style={{ fontSize: "1rem", flexShrink: 0 }}>{n.icon}</span>
                        <span style={{ fontSize: "0.78rem", color: "#4B5563", lineHeight: 1.6 }}>{n.tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Footer CTA ── */}
        <div
          className="px-8 py-5 flex items-center justify-between gap-4"
          style={{ borderTop: "1px solid #E8E0D5", background: "#FAFAF9" }}
        >
          <div style={{ fontSize: "0.78rem", color: "#9CA3AF", lineHeight: 1.5 }}>
            Need a mortgage advisor? Bell Listings can connect you with vetted lenders.
          </div>
          <a
            href="https://wa.me/254757660878?text=Hi%2C%20I%20need%20help%20with%20mortgage%20financing%20for%20a%20property%20in%20Kenya."
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
            style={{ background: "#25D366", color: "#fff" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.528 5.84L.073 23.927l6.235-1.636A11.935 11.935 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.373l-.36-.214-3.7.97.988-3.609-.235-.373A9.818 9.818 0 1112 21.818z"/>
            </svg>
            Talk to an Advisor
          </a>
        </div>
      </div>
    </div>
  )
}
