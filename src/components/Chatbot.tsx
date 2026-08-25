import { useState, useRef, useEffect } from "react"
import { PROPERTIES } from "../data/properties"
import type { Property } from "../data/properties"

function formatKES(n: number) {
  return n >= 1000 ? `KES ${(n / 1000).toFixed(0)}k` : `KES ${n}`
}

type MessageRole = "user" | "bot"

interface ChatMessage {
  id: number
  role: MessageRole
  text: string
  properties?: Property[]
  suggestions?: string[]
}

// ── Swahili normaliser ───────────────────────────────────────────────────────

const SWAHILI_MAP: [RegExp, string][] = [
  [/\bnyumba\b/gi, "house"],
  [/\bchumba\b/gi, "bedroom"],
  [/\bvyumba\b/gi, "bedrooms"],
  [/\bghorofa\b/gi, "apartment"],
  [/\bbei\b/gi, "price"],
  [/\bpesa\b/gi, "budget"],
  [/\bgharama\b/gi, "price"],
  [/\bnafuu\b/gi, "affordable"],
  [/\bghali sana\b/gi, "very expensive"],
  [/\bghali\b/gi, "expensive"],
  [/\bnataka\b/gi, "I want"],
  [/\bninahitaji\b/gi, "I need"],
  [/\btafuta\b/gi, "find"],
  [/\btafadhali\b/gi, "please"],
  [/\bpango\b/gi, "rent"],
  [/\bkodi\b/gi, "rent"],
  [/\bkukodi\b/gi, "rent"],
  [/\bnunua\b/gi, "buy"],
  [/\bkununua\b/gi, "buy"],
  [/\bmtaa\b/gi, "estate"],
  [/\bkaribu na\b/gi, "near"],
  [/\bjirani\b/gi, "near"],
  [/\bbedsita\b/gi, "bedsitter"],
  [/\bwestie\b/gi, "Westlands"],
  [/\bkassi\b/gi, "Kasarani"],
  [/\bnairobs\b/gi, "Nairobi"],
  [/\bmsa\b/gi, "Mombasa"],
  [/\bsawa\b/gi, "ok"],
  [/\basante\b/gi, "thanks"],
  [/\bhabari\b/gi, "hello"],
  [/\bjambo\b/gi, "hello"],
  [/\bniaje\b/gi, "hello"],
  [/\bsasa\b/gi, "hello"],
  [/\bhujambo\b/gi, "hello"],
  [/\bmambo\b/gi, "hello"],
]

function normalise(input: string): string {
  let out = input
  for (const [pat, rep] of SWAHILI_MAP) {
    out = out.replace(pat, rep)
  }
  return out
}

// ── NLP helpers ─────────────────────────────────────────────────────────────

const AREA_KEYWORDS: Record<string, string[]> = {
  Nairobi: ["nairobi", "nrb", "nairobs"],
  Westlands: ["westlands", "west lands", "westie"],
  Kilimani: ["kilimani"],
  Karen: ["karen"],
  Lavington: ["lavington"],
  "South C": ["south c"],
  "South B": ["south b"],
  Donholm: ["donholm"],
  Kasarani: ["kasarani", "kassi"],
  Buruburu: ["buruburu"],
  Ruaka: ["ruaka"],
  Rongai: ["rongai"],
  Syokimau: ["syokimau"],
  Ngong: ["ngong"],
  Kitengela: ["kitengela"],
  Githurai: ["githurai"],
  "Imara Daima": ["imara daima", "imara"],
  Umoja: ["umoja"],
  Ruiru: ["ruiru"],
  Mombasa: ["mombasa", "msa", "coast"],
  Nyali: ["nyali"],
  Bamburi: ["bamburi"],
  Shanzu: ["shanzu"],
  Mtwapa: ["mtwapa"],
  Nakuru: ["nakuru"],
  Milimani: ["milimani"],
  Kisumu: ["kisumu"],
  Eldoret: ["eldoret"],
  Thika: ["thika"],
  Kiambu: ["kiambu"],
  Naivasha: ["naivasha"],
  Nyeri: ["nyeri"],
  Meru: ["meru"],
  Machakos: ["machakos"],
  Kisii: ["kisii"],
}

const CITY_ALTERNATIVES: Record<string, string[]> = {
  Nairobi: ["Westlands", "Kilimani", "Kasarani", "Donholm", "Rongai", "Ruaka"],
  Mombasa: ["Nyali", "Bamburi", "Shanzu", "Mtwapa"],
  Nakuru: ["Milimani"],
}

function extractAreas(input: string): string[] {
  const lower = input.toLowerCase()
  const found: string[] = []
  for (const [area, keywords] of Object.entries(AREA_KEYWORDS)) {
    if (keywords.some((k) => lower.includes(k))) found.push(area)
  }
  return found
}

function extractBeds(input: string): number | null {
  const lower = input.toLowerCase()
  if (/studio|bedsitter/.test(lower)) return 0
  const match = lower.match(/(\d+)\s*(?:bed(?:room)?s?|br)\b/)
  return match ? parseInt(match[1]) : null
}

function extractMaxPrice(input: string): number | null {
  const patterns = [
    /(?:under|below|max|budget\s+of|not\s+more\s+than|less\s+than|at\s+most)\s+(?:kes\s+)?(\d[\d,]*)\s*k?\b/i,
    /(\d[\d,]*)\s*k?\s+(?:or\s+less|max|maximum)/i,
  ]
  for (const pat of patterns) {
    const m = input.match(pat)
    if (m) {
      const raw = parseInt(m[1].replace(/,/g, ""))
      return raw < 1000 ? raw * 1000 : raw
    }
  }
  return null
}

function extractMinPrice(input: string): number | null {
  const m = input.match(/(?:above|over|more\s+than|at\s+least|minimum)\s+(?:kes\s+)?(\d[\d,]*)\s*k?\b/i)
  if (!m) return null
  const raw = parseInt(m[1].replace(/,/g, ""))
  return raw < 1000 ? raw * 1000 : raw
}

function extractTier(input: string): string | null {
  const lower = input.toLowerCase()
  if (/budget|cheap|affordable|low.?cost|low.?income|nafuu/.test(lower)) return "budget"
  if (/middle.?class|mid.?range|moderate|average/.test(lower)) return "middle"
  if (/premium|luxury|high.?end|executive|upmarket/.test(lower)) return "premium"
  return null
}

function extractType(input: string): string | null {
  const lower = input.toLowerCase()
  if (/villa/.test(lower)) return "Villa"
  if (/townhouse|town house/.test(lower)) return "Townhouse"
  if (/maisonette/.test(lower)) return "Maisonette"
  if (/bungalow/.test(lower)) return "Bungalow"
  if (/bedsitter|bed sitter/.test(lower)) return "Bedsitter"
  if (/studio/.test(lower)) return "Studio"
  if (/apartment|flat/.test(lower)) return "Apartment"
  if (/house\b/.test(lower)) return "House"
  return null
}

function searchProperties(input: string): Property[] {
  const areas = extractAreas(input)
  const beds = extractBeds(input)
  const maxPrice = extractMaxPrice(input)
  const minPrice = extractMinPrice(input)
  const tier = extractTier(input)
  const type = extractType(input)
  const lower = input.toLowerCase()
  const petFriendly = /pet.friendly|pets?\s+allowed|dog|cat/.test(lower)
  const furnished = /furnished/.test(lower)
  const pool = /pool|swimming/.test(lower)
  const nearSGR = /sgr|train|commuter/.test(lower)
  const nearBeach = /beach|coastal|ocean|sea/.test(lower)

  return PROPERTIES.filter((p) => {
    if (areas.length > 0) {
      const match = areas.some(
        (a) =>
          p.area.toLowerCase().includes(a.toLowerCase()) ||
          p.city.toLowerCase().includes(a.toLowerCase()) ||
          p.estate.toLowerCase().includes(a.toLowerCase()),
      )
      if (!match) return false
    }
    if (beds !== null) {
      if (beds === 0 && p.beds !== 0) return false
      if (beds > 0 && p.beds !== beds) return false
    }
    if (maxPrice !== null && p.rentKES > maxPrice) return false
    if (minPrice !== null && p.rentKES < minPrice) return false
    if (tier !== null && p.tier !== tier) return false
    if (type !== null && !p.type.toLowerCase().includes(type.toLowerCase())) return false
    if (petFriendly && !p.petFriendly) return false
    if (furnished && !p.furnished) return false
    if (pool && !p.amenities.some((a) => /pool|swimming/i.test(a))) return false
    if (nearSGR && !p.nearbyTransport.some((t) => /sgr/i.test(t))) return false
    if (nearBeach && !p.amenities.some((a) => /beach/i.test(a)) && !p.tags.some((t) => /beach|ocean/i.test(t))) {
      return false
    }
    return true
  })
}

// ── Human-like no-results handler ────────────────────────────────────────────

function buildNoResultsResponse(areas: string[], rawInput: string): Omit<ChatMessage, "id" | "role"> {
  const area = areas[0] || "that area"

  const cityMatch = Object.entries(CITY_ALTERNATIVES).find(([, alts]) =>
    alts.some((a) => a.toLowerCase() === area.toLowerCase()),
  )
  const city = cityMatch ? cityMatch[0] : null
  const alternatives = city ? CITY_ALTERNATIVES[city].filter((a) => a !== area) : []

  const altProps = alternatives.flatMap((alt) =>
    PROPERTIES.filter(
      (p) =>
        p.area.toLowerCase().includes(alt.toLowerCase()) ||
        p.city.toLowerCase().includes(alt.toLowerCase()),
    ),
  )

  const cityProps = city ? PROPERTIES.filter((p) => p.city === city) : PROPERTIES
  const avgRent = cityProps.length
    ? Math.round(cityProps.reduce((s, p) => s + p.rentKES, 0) / cityProps.length)
    : 0

  const openers = [
    `Pole! We don't have listings in ${area} right now`,
    `Hmm, ${area} isn't in our database yet`,
    `We haven't got anything in ${area} at the moment`,
    `${area} — we're still building up listings there`,
  ]
  const opener = openers[Math.abs(area.charCodeAt(0)) % openers.length]

  if (altProps.length > 0 && city) {
    return {
      text: `${opener}, but don't worry — we have great options nearby in ${city}${avgRent ? ` (avg ${formatKES(avgRent)}/mo)` : ""}. Here's what's closest:`,
      properties: altProps.slice(0, 4),
      suggestions: [`All in ${city}`, `Affordable ${city}`, `2BR ${city} under 60k`],
    }
  }

  const broadResults = searchProperties(rawInput.replace(area, ""))
  if (broadResults.length > 0) {
    return {
      text: `${opener}. But I found some similar options elsewhere in Kenya:`,
      properties: broadResults.slice(0, 4),
      suggestions: ["All Nairobi listings", "Affordable Mombasa", "2BR under 50k"],
    }
  }

  return {
    text: `${opener}. We're actively expanding — contact Bell Listings and they'll flag it the moment something comes up there. In the meantime, try a broader search:`,
    suggestions: ["Show all Nairobi", "Affordable anywhere", "2BR under 40k", "Premium properties"],
  }
}

// ── Response generator ───────────────────────────────────────────────────────

const GREETINGS = [/^(hi|hello|hey|habari|sasa|jambo|niaje|mambo|hujambo|salama)\b/i]
const THANKS = [/^(thanks?|asante|thank you|appreciate)/i]
const PRICE_Q = /cheapest|most affordable|lowest rent|cheap(?:est)? in|budget options?/i
const AREA_Q = /tell me about|what('s| is) (.+) like|describe (.+)/i
const AVAILABLE_Q = /available|vacant|can i move/i
const COUNT_Q = /how many|count of|number of/i

function generateResponse(rawInput: string): Omit<ChatMessage, "id" | "role"> {
  const input = normalise(rawInput)
  const lower = input.trim().toLowerCase()

  if (GREETINGS.some((p) => p.test(lower))) {
    return {
      text: "Karibu! 🏡 I'm Maski, your Maskani Hub assistant. Niambie unataka nini — area, budget, bedrooms — and I'll find the best options. You can type in English or Swahili!",
      suggestions: ["2BR Nairobi under 50k", "Nyumba nafuu Mombasa", "Pet friendly", "Premium Karen"],
    }
  }

  if (THANKS.some((p) => p.test(lower))) {
    const replies = [
      "No worries! 😊 Feel free to ask if you need anything else.",
      "Karibu sana! Kama una swali lingine, niambie tu. 🏡",
      "Anytime! Is there another area or budget you'd like to explore?",
    ]
    return {
      text: replies[Math.floor(Math.random() * replies.length)],
      suggestions: ["Show all listings", "Cheapest in Nairobi"],
    }
  }

  if (PRICE_Q.test(lower)) {
    const areas = extractAreas(lower)
    let pool = areas.length > 0
      ? PROPERTIES.filter((p) => areas.some((a) => p.city.toLowerCase().includes(a.toLowerCase()) || p.area.toLowerCase().includes(a.toLowerCase())))
      : PROPERTIES
    pool = [...pool].sort((a, b) => a.rentKES - b.rentKES).slice(0, 4)
    if (pool.length === 0) return buildNoResultsResponse(areas, rawInput)
    return {
      text: `Most affordable options${areas.length ? ` in ${areas.join(" / ")}` : ""} — starting at ${formatKES(pool[0].rentKES)}/mo:`,
      properties: pool,
      suggestions: ["Under KES 20k", "2BR under 40k", "Budget Nairobi"],
    }
  }

  if (COUNT_Q.test(lower)) {
    const areas = extractAreas(lower)
    if (areas.length > 0) {
      const count = PROPERTIES.filter((p) => areas.some((a) => p.city.toLowerCase().includes(a.toLowerCase()) || p.area.toLowerCase().includes(a.toLowerCase()))).length
      if (count === 0) return buildNoResultsResponse(areas, rawInput)
      return {
        text: `We have ${count} listing${count !== 1 ? "s" : ""} in ${areas.join(" / ")} right now. Here are some picks:`,
        properties: searchProperties(input).slice(0, 3),
      }
    }
    return {
      text: `We have ${PROPERTIES.length} active listings across Kenya — from budget bedsitters to premium villas. What are you looking for?`,
      suggestions: ["Show Nairobi", "Mombasa beach homes", "Premium properties"],
    }
  }

  const areaMatch = AREA_Q.exec(input)
  if (areaMatch) {
    const areas = extractAreas(input)
    const area = areas[0]
    if (area) {
      const local = PROPERTIES.filter((p) => p.area === area || p.city === area)
      if (local.length > 0) {
        const minR = Math.min(...local.map((p) => p.rentKES))
        const maxR = Math.max(...local.map((p) => p.rentKES))
        const tierDesc = local[0].tier === "premium" ? "high-end" : local[0].tier === "middle" ? "middle-class" : "budget-friendly"
        return {
          text: `${area} is a ${tierDesc} neighbourhood in ${local[0].city}. Rents range ${formatKES(minR)}–${formatKES(maxR)}/mo, ${local.length} listings available:`,
          properties: local.slice(0, 3),
          suggestions: [`All listings in ${area}`, `${area} under ${formatKES(minR + 20000)}`],
        }
      }
      return buildNoResultsResponse([area], rawInput)
    }
    return {
      text: "Which area would you like to know about? Try: Westlands, Karen, Nyali, or Milimani.",
      suggestions: ["Tell me about Karen", "What is Nyali like", "Westlands info"],
    }
  }

  if (AVAILABLE_Q.test(lower)) {
    const results = searchProperties(input)
    if (results.length > 0) {
      return {
        text: `Good news — ${results.length} propert${results.length > 1 ? "ies are" : "y is"} available:`,
        properties: results.slice(0, 4),
      }
    }
    return {
      text: "All current listings are available immediately. Narrow down by area or price to see what fits.",
      suggestions: ["Available Nairobi", "Under 50k now"],
    }
  }

  const detectedAreas = extractAreas(lower)
  const hasSearchIntent =
    detectedAreas.length > 0 ||
    extractBeds(lower) !== null ||
    extractMaxPrice(lower) !== null ||
    extractMinPrice(lower) !== null ||
    extractTier(lower) !== null ||
    extractType(lower) !== null ||
    /find|show|looking|search|want|need|bedroom|bed|apartment|house|studio|flat|villa|townhouse|bungalow|bedsitter|rent|kes|ksh|under|budget|afford|cheap|pet|furnished|pool|sgr|beach|buy|sale/i.test(lower)

  if (hasSearchIntent) {
    let results = searchProperties(input)
    const areas = detectedAreas

    // If specific area/filter combo returns nothing, try just the area (drop price/bed filters)
    if (results.length === 0 && areas.length > 0) {
      results = PROPERTIES.filter((p) =>
        areas.some(
          (a) =>
            p.area.toLowerCase().includes(a.toLowerCase()) ||
            p.city.toLowerCase().includes(a.toLowerCase()) ||
            p.estate.toLowerCase().includes(a.toLowerCase()),
        ),
      )
    }

    if (results.length === 0) {
      if (areas.length > 0) return buildNoResultsResponse(areas, rawInput)
      return {
        text: "Sijapata match — try relaxing the filters a bit. Wider budget or bigger area works well.",
        suggestions: ["2BR Nairobi under 60k", "Affordable anywhere in Kenya", "Studio apartments", "Furnished Mombasa"],
      }
    }

    const beds = extractBeds(input)
    const maxPrice = extractMaxPrice(input)
    let label = "Here are the best matches"
    if (areas.length) label += ` in ${areas.slice(0, 2).join(" / ")}`
    if (beds !== null) label += `, ${beds === 0 ? "studio" : `${beds} bedroom`}`
    if (maxPrice) label += `, under ${formatKES(maxPrice)}`
    return {
      text: `${label} (${results.length} found):`,
      properties: results.slice(0, 4),
      suggestions: results.length > 4
        ? [`Show all ${results.length} results`, "Filter by furnished", "Pet friendly only"]
        : undefined,
    }
  }

  const fallbacks = [
    "Niambie zaidi — what kind of home are you after? Area, budget, bedrooms? I'll find the best match. 🏡",
    "I can search all 200+ listings — just tell me the area or budget. Try: \"2BR Karen under 150k\" or \"nyumba nafuu Mombasa\".",
    "Habari! Tell me what you need and I'll pull the best options from across Kenya right away.",
  ]
  return {
    text: fallbacks[Math.floor(Math.random() * fallbacks.length)],
    suggestions: ["Show all listings", "Cheapest Nairobi", "Premium Karen", "Beach Mombasa"],
  }
}

// ── Component ────────────────────────────────────────────────────────────────

interface Props {
  onViewProperty?: (p: Property) => void
}

let msgId = 0

export default function Chatbot({ onViewProperty }: Props) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: msgId++,
      role: "bot",
      text: "Karibu! 🏡 I'm Maski, your Maskani Hub assistant. Niambie unataka nini — area, budget, bedrooms — and I'll find the best options. You can type in English or Swahili!",
      suggestions: ["2BR Nairobi under 50k", "Nyumba nafuu Mombasa", "Pet friendly", "Premium Karen"],
    },
  ])
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typing])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  const send = (text: string) => {
    if (!text.trim()) return
    const userMsg: ChatMessage = { id: msgId++, role: "user", text: text.trim() }
    setMessages((m) => [...m, userMsg])
    setInput("")
    setTyping(true)
    setTimeout(() => {
      const response = generateResponse(text.trim())
      const botMsg: ChatMessage = { id: msgId++, role: "bot", ...response }
      setMessages((m) => [...m, botMsg])
      setTyping(false)
    }, 650 + Math.random() * 550)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    send(input)
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300"
        style={{ background: open ? "#1A1A1A" : "#B84520", color: "#fff", transform: open ? "rotate(45deg)" : "rotate(0)" }}
        aria-label="Open chat"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" /></svg>
        )}
      </button>

      {!open && (
        <span className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full" style={{ border: "2px solid #B84520", animation: "pulse-ring 2s ease-out infinite", pointerEvents: "none" }} />
      )}

      <div
        className="fixed bottom-24 right-6 z-40 flex flex-col rounded-2xl shadow-2xl overflow-hidden transition-all duration-300"
        style={{ width: "min(380px, calc(100vw - 24px))", height: open ? 520 : 0, opacity: open ? 1 : 0, pointerEvents: open ? "all" : "none", background: "#fff", border: "1px solid #E8E0D5", transformOrigin: "bottom right", transform: open ? "scale(1)" : "scale(0.9)" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0" style={{ background: "#B84520" }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0" style={{ background: "#C8891A" }}>🏡</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 600, fontSize: "0.9rem", fontFamily: "Outfit, sans-serif" }}>Maski — AI Assistant</div>
            <div style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.7rem", fontFamily: "Outfit, sans-serif" }}>English & Swahili · Kenya-wide</div>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: "#4ADE80" }} />
            <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.7rem" }}>Online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ background: "#F7F5F1" }}>
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div style={{ maxWidth: "88%" }}>
                <div
                  className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                  style={{
                    background: msg.role === "user" ? "#B84520" : "#fff",
                    color: msg.role === "user" ? "#fff" : "#1A1A1A",
                    borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    fontFamily: "Outfit, sans-serif",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.text}
                </div>
                {msg.properties && msg.properties.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {msg.properties.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => onViewProperty?.(p)}
                        className="w-full text-left flex gap-3 p-2.5 rounded-xl transition-all"
                        style={{ background: "#fff", border: "1px solid #E8E0D5", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                      >
                        <img src={p.img} alt={p.estate} className="w-16 h-12 rounded-lg object-cover flex-shrink-0 bg-gray-100" />
                        <div className="min-w-0">
                          <div className="font-semibold truncate" style={{ fontSize: "0.8rem", color: "#1A1A1A", fontFamily: "Outfit, sans-serif" }}>{p.area} — {p.type}</div>
                          <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>{p.estate}</div>
                          <div style={{ fontSize: "0.8rem", color: "#B84520", fontWeight: 600 }}>{formatKES(p.rentKES)}/mo</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {msg.suggestions && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {msg.suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{ background: "#FBF0EC", color: "#B84520", border: "1px solid #E8C4B0", fontFamily: "Outfit, sans-serif" }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-2xl flex items-center gap-1.5" style={{ background: "#fff", borderRadius: "18px 18px 18px 4px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                {[0, 1, 2].map((i) => (
                  <span key={i} className="w-2 h-2 rounded-full bg-gray-400 inline-block" style={{ animation: `bounce 1s ${i * 0.15}s infinite` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3 py-3 flex-shrink-0" style={{ background: "#fff", borderTop: "1px solid #E8E0D5" }}>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Nataka 2BR Nairobi under 50k…"
            className="flex-1 text-sm outline-none bg-transparent"
            style={{ color: "#1A1A1A", fontFamily: "Outfit, sans-serif" }}
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: input.trim() ? "#B84520" : "#E8E0D5", color: "#fff" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
          </button>
        </form>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </>
  )
}
