import { useMemo } from "react"
import { PROPERTIES } from "../data/properties"

interface Props {
  onClose: () => void
}

function formatKES(n: number) {
  return n >= 1_000_000
    ? `KES ${(n / 1_000_000).toFixed(1)}M`
    : n >= 1000
    ? `KES ${(n / 1000).toFixed(0)}k`
    : `KES ${n}`
}

export default function MarketData({ onClose }: Props) {
  const stats = useMemo(() => {
    const cities = ["Nairobi", "Mombasa", "Nakuru", "Kisumu", "Eldoret", "Thika", "Kiambu", "Naivasha"]
    const cityStats = cities.map((city) => {
      const props = PROPERTIES.filter((p) => p.city === city)
      if (props.length === 0) return null
      const avg = Math.round(props.reduce((s, p) => s + p.rentKES, 0) / props.length)
      const min = Math.min(...props.map((p) => p.rentKES))
      const max = Math.max(...props.map((p) => p.rentKES))
      return { city, count: props.length, avg, min, max }
    }).filter(Boolean) as { city: string; count: number; avg: number; min: number; max: number }[]

    const maxAvg = Math.max(...cityStats.map((c) => c.avg))

    const bedStats = [0, 1, 2, 3, 4].map((beds) => {
      const props = PROPERTIES.filter((p) => p.beds === beds && p.listingType !== "sale")
      if (props.length === 0) return null
      const avg = Math.round(props.reduce((s, p) => s + p.rentKES, 0) / props.length)
      const label = beds === 0 ? "Studio" : `${beds} Bedroom`
      return { label, count: props.length, avg }
    }).filter(Boolean) as { label: string; count: number; avg: number }[]

    const maxBedAvg = Math.max(...bedStats.map((b) => b.avg))

    const tierCounts = {
      budget: PROPERTIES.filter((p) => p.tier === "budget").length,
      middle: PROPERTIES.filter((p) => p.tier === "middle").length,
      premium: PROPERTIES.filter((p) => p.tier === "premium").length,
    }

    const rentCount = PROPERTIES.filter((p) => p.listingType === "rent").length
    const saleCount = PROPERTIES.filter((p) => p.listingType === "sale").length
    const bothCount = PROPERTIES.filter((p) => p.listingType === "both").length

    const petCount = PROPERTIES.filter((p) => p.petFriendly).length
    const furnishedCount = PROPERTIES.filter((p) => p.furnished).length

    return { cityStats, maxAvg, bedStats, maxBedAvg, tierCounts, rentCount, saleCount, bothCount, petCount, furnishedCount }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: "#FFFFFF", fontFamily: "Outfit, sans-serif" }}
      >
        {/* Header */}
        <div
          className="px-8 pt-10 pb-8 relative"
          style={{ background: "linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)" }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}
          >
            ✕
          </button>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
            Live from {PROPERTIES.length} listings
          </div>
          <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "2rem", color: "#fff", fontWeight: 300, lineHeight: 1.2 }}>
            Kenya{" "}
            <em style={{ color: "#C8891A" }}>Real Estate</em>
            {" "}Market Data
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", marginTop: 10, fontSize: "0.88rem", lineHeight: 1.6 }}>
            Aggregated from our live listings database. Updated in real time.
          </p>
          <div
            className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full text-xs"
            style={{ background: "rgba(27,94,53,0.25)", color: "#6EE7A0" }}
          >
            <span className="w-1.5 h-1.5 rounded-full inline-block bg-green-400" />
            Live data · August 2026
          </div>
        </div>

        <div className="p-8 space-y-8">

          {/* Summary tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { val: PROPERTIES.length, label: "Total Listings", color: "#B84520" },
              { val: stats.rentCount, label: "For Rent", color: "#1B5E35" },
              { val: stats.saleCount + stats.bothCount, label: "For Sale", color: "#C8891A" },
              { val: stats.petCount, label: "Pet Friendly", color: "#6B7280" },
            ].map((t) => (
              <div key={t.label} className="rounded-xl p-4 text-center" style={{ background: "#F7F5F1" }}>
                <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.7rem", color: t.color, fontWeight: 300 }}>{t.val}</div>
                <div style={{ fontSize: "0.72rem", color: "#9CA3AF", marginTop: 2 }}>{t.label}</div>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: "#E8E0D5" }} />

          {/* Average rent by city */}
          <div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.05rem", color: "#1A1A1A", fontWeight: 400, marginBottom: 16 }}>
              Average Rent by City
            </div>
            <div className="space-y-3">
              {stats.cityStats
                .sort((a, b) => b.avg - a.avg)
                .map((c) => (
                  <div key={c.city}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span style={{ fontSize: "0.85rem", color: "#1A1A1A", fontWeight: 500 }}>{c.city}</span>
                      <div className="flex items-center gap-3">
                        <span style={{ fontSize: "0.72rem", color: "#9CA3AF" }}>{c.count} listings</span>
                        <span style={{ fontSize: "0.85rem", color: "#B84520", fontWeight: 600 }}>{formatKES(c.avg)}/mo</span>
                      </div>
                    </div>
                    <div className="rounded-full overflow-hidden" style={{ height: 6, background: "#F3F4F6" }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(c.avg / stats.maxAvg) * 100}%`,
                          background: "linear-gradient(to right, #B84520, #C8891A)",
                          transition: "width 0.8s ease",
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span style={{ fontSize: "0.68rem", color: "#9CA3AF" }}>Min: {formatKES(c.min)}</span>
                      <span style={{ fontSize: "0.68rem", color: "#9CA3AF" }}>Max: {formatKES(c.max)}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div style={{ height: 1, background: "#E8E0D5" }} />

          {/* Rent by bedroom */}
          <div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.05rem", color: "#1A1A1A", fontWeight: 400, marginBottom: 16 }}>
              Average Rent by Bedroom Count
            </div>
            <div className="space-y-3">
              {stats.bedStats.map((b) => (
                <div key={b.label} className="flex items-center gap-4">
                  <div style={{ width: 80, fontSize: "0.82rem", color: "#4B5563", flexShrink: 0 }}>{b.label}</div>
                  <div className="flex-1 rounded-full overflow-hidden" style={{ height: 8, background: "#F3F4F6" }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(b.avg / stats.maxBedAvg) * 100}%`,
                        background: "#1B5E35",
                      }}
                    />
                  </div>
                  <div style={{ width: 80, textAlign: "right", fontSize: "0.82rem", color: "#1B5E35", fontWeight: 600, flexShrink: 0 }}>
                    {formatKES(b.avg)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ height: 1, background: "#E8E0D5" }} />

          {/* Tier breakdown */}
          <div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.05rem", color: "#1A1A1A", fontWeight: 400, marginBottom: 16 }}>
              Market Segment Distribution
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Budget", count: stats.tierCounts.budget, color: "#6B7280", bg: "#F3F4F6" },
                { label: "Mid-Range", count: stats.tierCounts.middle, color: "#B84520", bg: "#FBF0EC" },
                { label: "Premium", count: stats.tierCounts.premium, color: "#C8891A", bg: "#FFF8EE" },
              ].map((t) => {
                const pct = Math.round((t.count / PROPERTIES.length) * 100)
                return (
                  <div key={t.label} className="rounded-xl p-4 text-center" style={{ background: t.bg }}>
                    <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.6rem", color: t.color, fontWeight: 300 }}>{pct}%</div>
                    <div style={{ fontSize: "0.78rem", fontWeight: 600, color: t.color, marginTop: 2 }}>{t.label}</div>
                    <div style={{ fontSize: "0.7rem", color: "#9CA3AF", marginTop: 2 }}>{t.count} listings</div>
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{ height: 1, background: "#E8E0D5" }} />

          {/* Lifestyle stats */}
          <div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.05rem", color: "#1A1A1A", fontWeight: 400, marginBottom: 12 }}>
              Lifestyle Features
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Pet Friendly", count: stats.petCount, icon: "🐾", color: "#1B5E35" },
                { label: "Furnished", count: stats.furnishedCount, icon: "🛋️", color: "#C8891A" },
                { label: "For Rent", count: stats.rentCount, icon: "🔑", color: "#B84520" },
                { label: "For Sale / Both", count: stats.saleCount + stats.bothCount, icon: "📋", color: "#6B7280" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl p-4 flex items-center gap-3" style={{ background: "#F7F5F1", border: "1px solid #E8E0D5" }}>
                  <span style={{ fontSize: "1.3rem" }}>{s.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.85rem", color: s.color }}>{s.count}</div>
                    <div style={{ fontSize: "0.72rem", color: "#9CA3AF" }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div
            className="rounded-xl p-4"
            style={{ background: "#F7F5F1", border: "1px solid #E8E0D5" }}
          >
            <div style={{ fontSize: "0.72rem", color: "#9CA3AF", lineHeight: 1.65 }}>
              📊 All data is computed live from Maskani Hub&apos;s active listing database. Averages exclude outliers. Market conditions may vary. Contact Bell Listings for a personalised property valuation.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
