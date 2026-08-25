import { useState, useEffect, useRef } from "react"
import { useTheme } from "../context/ThemeContext"
import AuthModal from "./AuthModal"
import { PROPERTIES, CITIES, type Property } from "../data/properties"
import PropertyModal from "./PropertyModal"
import Chatbot from "./Chatbot"
import ContactUs from "./ContactUs"
import OurStory from "./OurStory"
import MarketData from "./MarketData"
import MortgageCalculator from "./MortgageCalculator"

type ListingFilter = "All" | "rent" | "sale"

function formatKES(n: number) {
  return n >= 1000 ? `KES ${(n / 1000).toFixed(0)}k` : `KES ${n}`
}

const TIER_LABEL: Record<string, string> = { budget: "Budget", middle: "Mid-Range", premium: "Premium" }
const TIER_BG: Record<string, string> = {
  budget: "rgba(107,114,128,0.12)",
  middle: "rgba(184,69,32,0.1)",
  premium: "rgba(200,137,26,0.12)",
}
const TIER_FG: Record<string, string> = {
  budget: "#6B7280",
  middle: "#B84520",
  premium: "#C8891A",
}

function BedIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" />
    </svg>
  )
}
function BathIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M7 6c0-1.1.9-2 2-2s2 .9 2 2v1H7V6zm12 5H4V6c0-1.66 1.34-3 3-3 1.13 0 2.12.63 2.63 1.56C10.07 4.22 10.5 4 11 4c1.66 0 3 1.34 3 3v4h5V6h2v5zM4 13h16l-1.45 7.26C18.37 21.27 17.59 22 16.65 22H7.35c-.95 0-1.72-.73-1.9-1.74L4 13z" />
    </svg>
  )
}
function SearchIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function PropertyCard({ p, onOpen }: { p: Property; onOpen: (p: Property) => void }) {
  return (
    <div
      onClick={() => onOpen(p)}
      className="group flex flex-col rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        boxShadow: "var(--card-shadow)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--card-shadow-hover)"
        ;(e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--card-shadow)"
        ;(e.currentTarget as HTMLElement).style.transform = "translateY(0)"
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-100" style={{ height: 200 }}>
        <img
          src={p.img}
          alt={p.estate}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)" }} />

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <span
            className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide"
            style={{ background: TIER_BG[p.tier], color: TIER_FG[p.tier], backdropFilter: "blur(6px)", border: `1px solid ${TIER_FG[p.tier]}33` }}
          >
            {TIER_LABEL[p.tier]}
          </span>
          {p.verified && (
            <span
              className="px-2 py-0.5 rounded-md text-[10px] font-semibold"
              style={{ background: "rgba(27,94,53,0.88)", color: "#fff", backdropFilter: "blur(6px)" }}
            >
              ✓ Verified
            </span>
          )}
        </div>

        {/* Photo count badge */}
        {p.images && p.images.length > 1 && (
          <div
            className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
            style={{ background: "rgba(0,0,0,0.5)", color: "#fff", backdropFilter: "blur(4px)" }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
            {p.images.length}
          </div>
        )}

        {/* Price on image */}
        <div className="absolute bottom-3 left-3">
          {p.listingType !== "sale" ? (
            <>
              <span style={{ fontFamily: "Fraunces, serif", fontSize: "1.2rem", color: "#fff", fontWeight: 400 }}>
                {formatKES(p.rentKES)}
              </span>
              <span className="text-xs ml-1" style={{ color: "rgba(255,255,255,0.65)" }}>/mo</span>
              {p.rentUSD && (
                <div style={{ fontSize: "0.75rem", color: "#F5C842", fontWeight: 600, marginTop: 1 }}>
                  ${p.rentUSD.toLocaleString()}/mo USD
                </div>
              )}
            </>
          ) : null}
          {p.salePriceKES && (
            <div style={{ fontSize: p.listingType === "sale" ? "1.15rem" : "0.8rem", color: p.listingType === "sale" ? "#F5C842" : "#F5C842", fontWeight: 600, fontFamily: "Fraunces, serif", marginTop: p.listingType !== "sale" ? 2 : 0 }}>
              {p.salePriceKES >= 1_000_000 ? `KES ${(p.salePriceKES / 1_000_000).toFixed(1)}M` : formatKES(p.salePriceKES)}
              {p.salePriceUSD && <span style={{ fontSize: "0.72rem", fontFamily: "Outfit, sans-serif", marginLeft: 5, color: "rgba(255,220,100,0.8)" }}>/ ${(p.salePriceUSD / 1000).toFixed(0)}K USD</span>}
              {p.listingType === "sale" && <span style={{ fontSize: "0.72rem", marginLeft: 5, color: "rgba(255,255,255,0.6)", fontFamily: "Outfit, sans-serif" }}>sale price</span>}
            </div>
          )}
        </div>
        {/* Listing type pill */}
        <div className="absolute bottom-3 right-3">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{
              background: p.listingType === "sale" ? "#C8891A" : p.listingType === "both" ? "rgba(184,69,32,0.85)" : "rgba(184,69,32,0.85)",
              color: "#fff",
              backdropFilter: "blur(4px)",
            }}>
            {p.listingType === "rent" ? "For Rent" : p.listingType === "sale" ? "For Sale" : "Rent & Sale"}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        <div>
          <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.95rem", fontFamily: "Outfit, sans-serif", lineHeight: 1.3 }}>
            {p.area}
            <span style={{ fontWeight: 400, color: "var(--text-faint)" }}> · {p.city}</span>
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 2 }}>{p.estate}</div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-faint)", marginTop: 1 }}>{p.type}</div>
        </div>

        {/* Specs row */}
        <div className="flex items-center gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
          <span className="flex items-center gap-1.5">
            <BedIcon />
            {p.beds === 0 ? "Studio" : `${p.beds} Bed${p.beds > 1 ? "s" : ""}`}
          </span>
          <span className="flex items-center gap-1.5">
            <BathIcon />
            {p.baths} Bath{p.baths > 1 ? "s" : ""}
          </span>
          <span>{p.sqft.toLocaleString()} sqft</span>
        </div>

        {/* Key amenities preview */}
        <div className="flex flex-wrap gap-1.5">
          {p.amenities.slice(0, 3).map((a) => (
            <span
              key={a}
              className="px-2 py-0.5 rounded-md text-[10px]"
              style={{ background: "var(--bg-active)", color: "#B84520" }}
            >
              {a}
            </span>
          ))}
          {p.amenities.length > 3 && (
            <span className="px-2 py-0.5 rounded-md text-[10px]" style={{ background: "var(--bg-surface-2)", color: "var(--text-faint)" }}>
              +{p.amenities.length - 3}
            </span>
          )}
        </div>

        {/* Proximity highlights */}
        <div className="text-xs" style={{ color: "var(--text-faint)" }}>
          {p.nearbySchools[0] && (
            <span>🏫 {p.nearbySchools[0].name} ({p.nearbySchools[0].distance})</span>
          )}
        </div>

        {/* Footer */}
        <div
          className="mt-auto pt-3 flex items-center justify-between"
          style={{ borderTop: "1px solid var(--border-subtle)" }}
        >
          <div>
            <span style={{ fontSize: "0.72rem", color: "var(--text-faint)" }}>Reply </span>
            <span style={{ fontSize: "0.72rem", color: "#B84520", fontWeight: 600 }}>{p.replyTime}</span>
            {p.petFriendly && <span className="ml-2 text-xs">🐾</span>}
          </div>
          <button
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{ background: "#B84520", color: "#fff" }}
          >
            View →
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Filters sidebar ──────────────────────────────────────────────────────────

interface Filters {
  city: string
  tier: string
  listingType: ListingFilter
  minBeds: number | null
  maxRent: number | null
  search: string
  petFriendly: boolean
  furnished: boolean
}

const DEFAULT_FILTERS: Filters = {
  city: "All",
  tier: "All",
  listingType: "All",
  minBeds: null,
  maxRent: null,
  search: "",
  petFriendly: false,
  furnished: false,
}

function applyFilters(props: Property[], f: Filters): Property[] {
  return props.filter((p) => {
    if (f.city !== "All" && p.city !== f.city) return false
    if (f.tier !== "All" && p.tier !== f.tier) return false
    if (f.listingType !== "All") {
      if (f.listingType === "rent" && p.listingType === "sale") return false
      if (f.listingType === "sale" && p.listingType === "rent") return false
    }
    if (f.minBeds !== null && p.beds < f.minBeds) return false
    if (f.maxRent !== null && p.rentKES > f.maxRent) return false
    if (f.petFriendly && !p.petFriendly) return false
    if (f.furnished && !p.furnished) return false
    if (f.search) {
      const s = f.search.toLowerCase()
      if (
        !p.area.toLowerCase().includes(s) &&
        !p.city.toLowerCase().includes(s) &&
        !p.estate.toLowerCase().includes(s) &&
        !p.type.toLowerCase().includes(s) &&
        !p.tags.some((t) => t.toLowerCase().includes(s))
      )
        return false
    }
    return true
  })
}

export default function MainApp() {
  const { dark, toggle: toggleTheme } = useTheme()
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [selectedProp, setSelectedProp] = useState<Property | null>(null)
  const [visible, setVisible] = useState(false)
  const [showContact, setShowContact] = useState(false)
  const [showStory, setShowStory] = useState(false)
  const [showMarket, setShowMarket] = useState(false)
  const [showMortgage, setShowMortgage] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string; avatar?: string } | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Close user menu on outside click
  useEffect(() => {
    if (!showUserMenu) return
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setShowUserMenu(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [showUserMenu])

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  const filtered = applyFilters(PROPERTIES, filters)

  const setFilter = <K extends keyof Filters>(key: K, val: Filters[K]) =>
    setFilters((f) => ({ ...f, [key]: val }))

  return (
    <div
      className="w-full h-screen scroll-container"
      style={{
        background: "var(--bg-page)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.7s ease",
        fontFamily: "Outfit, sans-serif",
      }}
    >
      {/* ── Nav ──────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-30 flex items-center justify-between px-6 md:px-10"
        style={{
          height: 62,
          background: "var(--bg-nav)",
          borderBottom: "1px solid var(--border)",
          boxShadow: "var(--nav-shadow)",
        }}
      >
        <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.2rem", color: "#B84520", fontWeight: 400, letterSpacing: "0.01em" }}>
          Maskani<span style={{ color: "#C8891A" }}>Hub</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm" style={{ color: "var(--text-muted)" }}>
          <a href="#" style={{ color: "var(--text-muted)" }} className="hover:opacity-80 transition-opacity">Listings</a>
          <button onClick={() => setShowMarket(true)} style={{ color: "var(--text-muted)" }} className="hover:opacity-80 transition-opacity">
            Market Data
          </button>
          <button onClick={() => setShowMortgage(true)} style={{ color: "var(--text-muted)" }} className="hover:opacity-80 transition-opacity flex items-center gap-1">
            <span style={{ fontSize: "0.8rem" }}>🏦</span> Finance
          </button>
          <button onClick={() => setShowStory(true)} style={{ color: "var(--text-muted)" }} className="hover:opacity-80 transition-opacity">
            Our Story
          </button>
          <button onClick={() => setShowContact(true)} className="hover:opacity-80 transition-opacity font-medium" style={{ color: "#B84520" }}>
            Contact Us
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{ background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
            title={dark ? "Light mode" : "Dark mode"}
          >
            {dark ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-12.37l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0zM7.05 18.36l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0z"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/></svg>
            )}
          </button>

          <button
            onClick={() => setShowContact(true)}
            className="hidden md:flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-80"
            style={{ color: "#C8891A" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
            +254 757 660 878
          </button>

          {/* Auth: Sign In button OR user avatar */}
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu((v) => !v)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl transition-all"
                style={{ background: dark ? "#1A1A1A" : "#F7F5F1", border: "1px solid var(--border)" }}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-lg object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: "#B84520", color: "#fff" }}>
                    {user.name[0].toUpperCase()}
                  </div>
                )}
                <span className="hidden md:block text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  {user.name.split(" ")[0]}
                </span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "var(--text-muted)" }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {showUserMenu && (
                <div
                  className="absolute right-0 top-full mt-2 rounded-2xl overflow-hidden shadow-2xl z-50"
                  style={{ width: 220, background: dark ? "#111" : "#fff", border: "1px solid var(--border)" }}
                >
                  <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)" }}>{user.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 1 }}>{user.email}</div>
                  </div>
                  {[
                    { icon: "🏡", label: "Saved listings" },
                    { icon: "🔔", label: "My alerts" },
                    { icon: "📋", label: "Viewing requests" },
                  ].map((item) => (
                    <button key={item.label} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-all hover:opacity-80" style={{ color: "var(--text-secondary)" }}>
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                  <div style={{ borderTop: "1px solid var(--border)" }}>
                    <button
                      onClick={() => { setUser(null); setShowUserMenu(false) }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left"
                      style={{ color: "#B84520" }}
                    >
                      <span>→</span> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{ background: "var(--bg-surface-2)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--text-muted)" }}>
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
              Sign In
            </button>
          )}

          <button
            onClick={() => setShowContact(true)}
            className="px-4 py-2 rounded-xl text-sm font-semibold"
            style={{ background: "#B84520", color: "#fff" }}
          >
            List Property
          </button>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────── */}
      <div
        className="relative px-6 md:px-10 py-14"
        style={{
          background: "linear-gradient(135deg, #B84520 0%, #C95930 60%, #B84520 100%)",
        }}
      >
        <div style={{ maxWidth: 680 }}>
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-5"
            style={{ background: "rgba(255,255,255,0.12)", color: "#E8C4B0" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-300 inline-block" />
            {PROPERTIES.length} active listings across Kenya
          </div>

          <h1
            style={{
              fontFamily: "Fraunces, serif",
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              color: "#FFFFFF",
              fontWeight: 300,
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
            }}
          >
            Find your home,{" "}
            <em style={{ fontStyle: "italic", color: "#C8891A" }}>anywhere</em>
            {" "}in Kenya
          </h1>

          <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 14, fontSize: "0.95rem", lineHeight: 1.65 }}>
            Direct from verified landlords. Budget to premium — all towns covered.
          </p>

          {/* Search */}
          <div
            className="mt-7 flex items-center"
            style={{
              background: "var(--bg-card)",
              borderRadius: 999,
              padding: "10px 12px 10px 18px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            }}
          >
            <span style={{ color: "var(--text-faint)", marginRight: 10 }}>
              <SearchIcon />
            </span>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilter("search", e.target.value)}
              placeholder="Search area, estate, or type…"
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: "var(--text-primary)" }}
            />
            {filters.search && (
              <button onClick={() => setFilter("search", "")} style={{ color: "var(--text-faint)", marginRight: 8 }}>✕</button>
            )}
            <button
              className="flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold"
              style={{ background: "#B84520", color: "#fff" }}
            >
              Search
            </button>
          </div>

          {/* Quick filter pills */}
          <div className="mt-4 flex flex-wrap gap-2">
            {["2BR under 40k", "Pet friendly", "Near SGR", "Premium Karen", "Furnished"].map((q) => (
              <button
                key={q}
                onClick={() => setFilter("search", q)}
                className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.2)" }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Stats strip */}
        <div
          className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3"
        >
          {[
            { val: PROPERTIES.length, label: "Total listings" },
            { val: CITIES.length - 1, label: "Cities covered" },
            { val: PROPERTIES.filter((p) => p.listingType !== "rent").length, label: "Properties for sale" },
          ].map((s) => (
            <div
              key={s.label}
              className="text-center px-6 py-4 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}
            >
              <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.8rem", color: "#fff", fontWeight: 300 }}>
                {s.val}
              </div>
              <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.6)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main body ─────────────────────────────────────── */}
      <div className="flex gap-0" style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* Sidebar filters */}
        <aside
          className="hidden lg:flex flex-col gap-5 flex-shrink-0 p-6"
          style={{ width: 240, paddingTop: 28, borderRight: "1px solid var(--border)" }}
        >
          {/* Listing type toggle */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-faint)" }}>Listing Type</div>
            <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
              {(["All", "rent", "sale"] as const).map((lt) => (
                <button
                  key={lt}
                  onClick={() => setFilter("listingType", lt)}
                  className="flex-1 py-2 text-xs font-semibold transition-all"
                  style={{
                    background: filters.listingType === lt ? "#B84520" : "transparent",
                    color: filters.listingType === lt ? "#fff" : "var(--text-muted)",
                  }}
                >
                  {lt === "All" ? "All" : lt === "rent" ? "Rent" : "Buy"}
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: 1, background: "var(--border)" }} />

          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-faint)" }}>City</div>
            <div className="flex flex-col gap-1">
              {CITIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter("city", c)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-left transition-all"
                  style={{
                    background: filters.city === c ? "var(--bg-active)" : "transparent",
                    color: filters.city === c ? "#B84520" : "var(--text-secondary)",
                  }}
                >
                  <span>{c}</span>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-faint)" }}>
                    {c === "All" ? PROPERTIES.length : PROPERTIES.filter((p) => p.city === c).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: 1, background: "var(--border)" }} />

          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-faint)" }}>Tier</div>
            <div className="flex flex-col gap-1">
              {(["All", "budget", "middle", "premium"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter("tier", t)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-left transition-all"
                  style={{
                    background: filters.tier === t ? "var(--bg-active)" : "transparent",
                    color: filters.tier === t ? "#B84520" : "var(--text-secondary)",
                  }}
                >
                  <span>{t === "All" ? "All Tiers" : TIER_LABEL[t]}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: 1, background: "var(--border)" }} />

          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-faint)" }}>Bedrooms</div>
            <div className="flex flex-wrap gap-2">
              {[null, 0, 1, 2, 3, 4].map((b) => (
                <button
                  key={String(b)}
                  onClick={() => setFilter("minBeds", b)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: filters.minBeds === b ? "#B84520" : "var(--bg-surface-2)",
                    color: filters.minBeds === b ? "#fff" : "var(--text-secondary)",
                  }}
                >
                  {b === null ? "Any" : b === 0 ? "Studio" : `${b}+`}
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: 1, background: "var(--border)" }} />

          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-faint)" }}>Max Rent (KES)</div>
            <div className="flex flex-col gap-1.5">
              {[null, 20000, 40000, 60000, 100000, 200000].map((r) => (
                <button
                  key={String(r)}
                  onClick={() => setFilter("maxRent", r)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-left transition-all"
                  style={{
                    background: filters.maxRent === r ? "var(--bg-active)" : "transparent",
                    color: filters.maxRent === r ? "#B84520" : "var(--text-secondary)",
                  }}
                >
                  {r === null ? "No limit" : `Under ${formatKES(r)}`}
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: 1, background: "var(--border)" }} />

          <div className="flex flex-col gap-2">
            {[
              { key: "petFriendly" as const, label: "🐾 Pet Friendly" },
              { key: "furnished" as const, label: "🛋️ Furnished" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters[key]}
                  onChange={(e) => setFilter(key, e.target.checked)}
                  className="rounded"
                  style={{ accentColor: "#B84520" }}
                />
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{label}</span>
              </label>
            ))}
          </div>

          {Object.values(filters).some((v) => v !== "All" && v !== "" && v !== false && v !== null) && (
            <button
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="text-xs font-medium underline underline-offset-2"
              style={{ color: "#C8891A", textAlign: "left" }}
            >
              Clear all filters
            </button>
          )}
        </aside>

        {/* Listings */}
        <main className="flex-1 px-4 md:px-6 py-6">
          {/* Mobile filter strip */}
          <div className="flex lg:hidden items-center gap-2 mb-3 flex-wrap">
            <div className="flex rounded-full overflow-hidden" style={{ border: "1px solid var(--border)", background: "var(--bg-card)" }}>
              {(["All", "rent", "sale"] as const).map((lt) => (
                <button key={lt} onClick={() => setFilter("listingType", lt)}
                  className="px-3 py-1.5 text-xs font-semibold transition-all"
                  style={{ background: filters.listingType === lt ? "#B84520" : "transparent", color: filters.listingType === lt ? "#fff" : "var(--text-muted)" }}>
                  {lt === "All" ? "All" : lt === "rent" ? "Rent" : "Buy"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex lg:hidden items-center gap-2 mb-5 flex-wrap">
            {CITIES.map((c) => (
              <button
                key={c}
                onClick={() => setFilter("city", c)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  background: filters.city === c ? "#B84520" : "var(--bg-card)",
                  color: filters.city === c ? "#fff" : "var(--text-secondary)",
                  border: "1px solid var(--border)",
                }}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Results header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <span style={{ fontFamily: "Fraunces, serif", fontSize: "1.1rem", color: "var(--text-primary)", fontWeight: 400 }}>
                {filtered.length} propert{filtered.length !== 1 ? "ies" : "y"}
              </span>
              {filters.city !== "All" && (
                <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}> in {filters.city}</span>
              )}
            </div>
            <div className="flex gap-3 text-xs" style={{ color: "var(--text-faint)" }}>
              <span>Sorted by: Verified first</span>
            </div>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="py-24 text-center">
              <div style={{ fontSize: "3rem" }}>🏘️</div>
              <div style={{ color: "var(--text-muted)", marginTop: 12, fontFamily: "Outfit, sans-serif" }}>
                No properties match your filters.
              </div>
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="mt-4 text-sm font-medium underline"
                style={{ color: "#B84520" }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div
              className="grid gap-5"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
            >
              {[...filtered]
                .sort((a, b) => (b.verified ? 1 : 0) - (a.verified ? 1 : 0))
                .map((p) => (
                  <PropertyCard key={p.id} p={p} onOpen={setSelectedProp} />
                ))}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {selectedProp && (
        <PropertyModal property={selectedProp} onClose={() => setSelectedProp(null)} />
      )}

      {showContact && <ContactUs onClose={() => setShowContact(false)} />}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onAuth={(u) => { setUser(u); setShowAuth(false) }} />}
      {showStory && <OurStory onClose={() => setShowStory(false)} />}
      {showMarket && <MarketData onClose={() => setShowMarket(false)} />}
      {showMortgage && <MortgageCalculator onClose={() => setShowMortgage(false)} />}

      {/* Mobile sticky contact bar */}
      <div
        className="fixed bottom-0 left-0 right-0 md:hidden z-20 flex"
        style={{ background: "#B84520", borderTop: "1px solid #8B3318" }}
      >
        <a
          href="tel:+254757660878"
          className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold"
          style={{ color: "#fff", borderRight: "1px solid #8B3318" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
          Call Now
        </a>
        <a
          href="https://wa.me/254757660878"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold"
          style={{ color: "#fff", borderRight: "1px solid #8B3318" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          WhatsApp
        </a>
        <button
          onClick={() => setShowContact(true)}
          className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold"
          style={{ color: "#C8891A" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
          More
        </button>
      </div>

      {/* Chatbot */}
      <Chatbot onViewProperty={(p) => setSelectedProp(p)} />
    </div>
  )
}
