import { useEffect, useRef, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet"
import L from "leaflet"
import type { Property } from "../data/properties"
import Gallery from "./Gallery"
import MortgageCalculator from "./MortgageCalculator"
import "leaflet/dist/leaflet.css"

// Fix leaflet default marker icons in Vite
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
})

const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

function formatKES(n: number) {
  return n >= 1000 ? `KES ${(n / 1000).toFixed(0)}k` : `KES ${n}`
}

const TIER_LABEL: Record<string, string> = {
  budget: "Budget",
  middle: "Mid-Range",
  premium: "Premium",
}
const TIER_COLOR: Record<string, string> = {
  budget: "#6B7280",
  middle: "#B84520",
  premium: "#C8891A",
}

interface Props {
  property: Property
  onClose: () => void
}

type ViewingStep = "idle" | "form" | "queuing" | "confirmed"

export default function PropertyModal({ property: p, onClose }: Props) {
  const backdropRef = useRef<HTMLDivElement>(null)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [viewingStep, setViewingStep] = useState<ViewingStep>("idle")
  const [viewingName, setViewingName] = useState("")
  const [viewingPhone, setViewingPhone] = useState("")
  const [showFinance, setShowFinance] = useState(false)
  // Deterministic "others interested" count per property
  const othersCount = 3 + (p.id % 9)
  const images = p.images && p.images.length > 0 ? p.images : [p.img]

  const openGallery = (index: number) => {
    setGalleryIndex(index)
    setGalleryOpen(true)
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", handler)
      document.body.style.overflow = ""
    }
  }, [onClose])

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}&destination_place_id=${encodeURIComponent(p.estate + ", " + p.area + ", " + p.city)}`
  const googleMapsView = `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lon}`

  return (
    <>
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose()
      }}
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: "#FFFFFF" }}
      >
        {/* Header image + gallery strip */}
        <div className="relative" style={{ height: 280 }}>
          {/* Hero image — clickable to open gallery */}
          <button
            className="w-full h-full block"
            style={{ height: images.length > 1 ? 224 : 280 }}
            onClick={() => openGallery(0)}
          >
            <img src={images[0]} alt={p.estate} className="w-full h-full object-cover" />
          </button>

          <div
            className="absolute inset-0"
            style={{ height: images.length > 1 ? 224 : 280, background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%)", pointerEvents: "none" }}
          />

          {/* Photo count badge */}
          {images.length > 1 && (
            <button
              onClick={() => openGallery(0)}
              className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: "rgba(0,0,0,0.55)", color: "#fff", backdropFilter: "blur(4px)" }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
              {images.length} photos
            </button>
          )}

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
            style={{ background: "rgba(0,0,0,0.5)", color: "#fff" }}
          >
            ✕
          </button>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 flex gap-1 px-3 pb-1" style={{ height: 58, background: "#111" }}>
              {images.slice(0, 6).map((src, i) => (
                <button
                  key={i}
                  onClick={() => openGallery(i)}
                  className="flex-1 rounded overflow-hidden relative"
                  style={{ minWidth: 0, opacity: 1 }}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  {i === 5 && images.length > 6 && (
                    <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold" style={{ background: "rgba(0,0,0,0.55)" }}>
                      +{images.length - 6}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
          <div className="absolute bottom-4 left-5 right-5">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                style={{ background: TIER_COLOR[p.tier], color: "#fff" }}
              >
                {TIER_LABEL[p.tier]}
              </span>
              {p.verified && (
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                  style={{ background: "#1B5E35", color: "#fff" }}
                >
                  ✓ Verified Landlord
                </span>
              )}
              {p.furnished && (
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                  style={{ background: "#C8891A", color: "#fff" }}
                >
                  Furnished
                </span>
              )}
            </div>
            <h2 style={{ color: "#fff", fontFamily: "Fraunces, serif", fontSize: "1.5rem", fontWeight: 400 }}>
              {p.estate}
            </h2>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.85rem", fontFamily: "Outfit, sans-serif" }}>
              {p.area}, {p.city}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6" style={{ fontFamily: "Outfit, sans-serif" }}>
          {/* Price + key specs row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5"
            style={{ borderBottom: "1px solid #E8E0D5" }}>
            <div>
              {/* Listing type badge */}
              <div className="flex gap-2 mb-2">
                {p.listingType !== "sale" && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase"
                    style={{ background: "#FBF0EC", color: "#B84520" }}>For Rent</span>
                )}
                {p.listingType !== "rent" && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase"
                    style={{ background: "#FFF3E0", color: "#C8891A" }}>For Sale</span>
                )}
              </div>
              {/* Rent price */}
              {p.listingType !== "sale" && (
                <>
                  <div style={{ fontFamily: "Fraunces, serif", fontSize: "2rem", color: "#B84520", fontWeight: 400, lineHeight: 1.1 }}>
                    {formatKES(p.rentKES)}
                    <span style={{ fontSize: "1rem", color: "#6B7280" }}>/mo</span>
                  </div>
                  {p.rentUSD && (
                    <div style={{ fontSize: "1rem", color: "#C8891A", fontWeight: 600, marginTop: 2 }}>
                      ${p.rentUSD.toLocaleString()}<span style={{ fontSize: "0.8rem", color: "#9CA3AF", fontWeight: 400 }}>/mo USD</span>
                    </div>
                  )}
                </>
              )}
              {/* Sale price */}
              {p.salePriceKES && (
                <div style={{ marginTop: p.listingType === "both" ? 8 : 0 }}>
                  <div style={{ fontFamily: "Fraunces, serif", fontSize: p.listingType === "sale" ? "2rem" : "1.3rem", color: "#C8891A", fontWeight: 400, lineHeight: 1.1 }}>
                    {p.salePriceKES >= 1_000_000
                      ? `KES ${(p.salePriceKES / 1_000_000).toFixed(1)}M`
                      : formatKES(p.salePriceKES)}
                    <span style={{ fontSize: "0.85rem", color: "#9CA3AF", fontFamily: "Outfit, sans-serif" }}> sale price</span>
                  </div>
                  {p.salePriceUSD && (
                    <div style={{ fontSize: "0.9rem", color: "#6B7280", marginTop: 2 }}>
                      ${p.salePriceUSD.toLocaleString()} USD
                    </div>
                  )}
                </div>
              )}
              <div style={{ color: "#6B7280", fontSize: "0.85rem", marginTop: 4 }}>
                Available from {p.availableFrom}
              </div>
            </div>
            <div className="flex gap-3">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ background: "#B84520", color: "#fff" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z" />
                </svg>
                Get Directions
              </a>
              <a
                href={googleMapsView}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ background: "#F7F5F1", color: "#B84520", border: "1px solid #D4C9BE" }}
              >
                View on Maps
              </a>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Beds", value: p.beds === 0 ? "Studio" : `${p.beds}` },
              { label: "Baths", value: `${p.baths}` },
              { label: "Size", value: `${p.sqft} sqft` },
              { label: "Parking", value: p.parkingSpots === 0 ? "None" : `${p.parkingSpots} spot${p.parkingSpots > 1 ? "s" : ""}` },
            ].map((s) => (
              <div
                key={s.label}
                className="text-center py-3 rounded-xl"
                style={{ background: "#F7F5F1" }}
              >
                <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#1A1A1A" }}>{s.value}</div>
                <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold mb-2" style={{ color: "#1A1A1A" }}>About this property</h3>
            <p style={{ color: "#4B5563", lineHeight: 1.65, fontSize: "0.9rem" }}>{p.description}</p>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="text-sm font-semibold mb-3" style={{ color: "#1A1A1A" }}>
              Amenities & Features
            </h3>
            <div className="flex flex-wrap gap-2">
              {p.amenities.map((a) => (
                <span
                  key={a}
                  className="px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{ background: "#FBF0EC", color: "#B84520", border: "1px solid #E8C4B0" }}
                >
                  ✓ {a}
                </span>
              ))}
              {p.petFriendly && (
                <span className="px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{ background: "#FFF3E0", color: "#C8891A", border: "1px solid #F5D5A0" }}>
                  🐾 Pet Friendly
                </span>
              )}
            </div>
          </div>

          {/* Social infrastructure */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Schools */}
            <div className="rounded-xl p-4" style={{ background: "#F7F5F1" }}>
              <h4 className="text-xs font-bold mb-3 uppercase tracking-wide" style={{ color: "#B84520" }}>
                🏫 Nearby Schools
              </h4>
              <div className="space-y-2">
                {p.nearbySchools.map((s) => (
                  <div key={s.name} className="flex justify-between items-start">
                    <div>
                      <div style={{ fontSize: "0.82rem", color: "#1A1A1A", fontWeight: 500 }}>{s.name}</div>
                      <div style={{ fontSize: "0.72rem", color: "#9CA3AF" }}>{s.type}</div>
                    </div>
                    <span className="text-xs ml-2 flex-shrink-0 font-medium" style={{ color: "#B84520" }}>
                      {s.distance}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hospitals */}
            <div className="rounded-xl p-4" style={{ background: "#F7F5F1" }}>
              <h4 className="text-xs font-bold mb-3 uppercase tracking-wide" style={{ color: "#C8891A" }}>
                🏥 Hospitals & Clinics
              </h4>
              <div className="space-y-2">
                {p.nearbyHospitals.map((h) => (
                  <div key={h.name} className="flex justify-between items-center">
                    <span style={{ fontSize: "0.82rem", color: "#1A1A1A", fontWeight: 500 }}>{h.name}</span>
                    <span className="text-xs ml-2 flex-shrink-0 font-medium" style={{ color: "#C8891A" }}>
                      {h.distance}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Malls */}
            <div className="rounded-xl p-4" style={{ background: "#F7F5F1" }}>
              <h4 className="text-xs font-bold mb-3 uppercase tracking-wide" style={{ color: "#5B21B6" }}>
                🛍️ Shopping & Malls
              </h4>
              <div className="space-y-2">
                {p.nearbyMalls.map((m) => (
                  <div key={m.name} className="flex justify-between items-center">
                    <span style={{ fontSize: "0.82rem", color: "#1A1A1A", fontWeight: 500 }}>{m.name}</span>
                    <span className="text-xs ml-2 flex-shrink-0 font-medium" style={{ color: "#5B21B6" }}>
                      {m.distance}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Transport */}
            <div className="rounded-xl p-4" style={{ background: "#F7F5F1" }}>
              <h4 className="text-xs font-bold mb-3 uppercase tracking-wide" style={{ color: "#1D4ED8" }}>
                🚌 Transport Links
              </h4>
              <div className="space-y-1.5">
                {p.nearbyTransport.map((t) => (
                  <div key={t} style={{ fontSize: "0.82rem", color: "#374151" }}>
                    · {t}
                  </div>
                ))}
                <div style={{ fontSize: "0.78rem", color: "#9CA3AF", marginTop: 6 }}>
                  {p.distanceToCBD} km from CBD
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div>
            <h3 className="text-sm font-semibold mb-3" style={{ color: "#1A1A1A" }}>
              Location
            </h3>
            <div className="rounded-xl overflow-hidden" style={{ height: 260 }}>
              <MapContainer
                center={[p.lat, p.lon]}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[p.lat, p.lon]} icon={customIcon}>
                  <Popup>
                    <div style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.85rem" }}>
                      <strong>{p.estate}</strong>
                      <br />
                      {p.area}, {p.city}
                      <br />
                      {p.listingType !== "sale" ? `${formatKES(p.rentKES)}/mo` : ""}
                      {p.salePriceKES ? ` · KES ${(p.salePriceKES / 1_000_000).toFixed(1)}M` : ""}
                    </div>
                  </Popup>
                </Marker>
                <Circle
                  center={[p.lat, p.lon]}
                  radius={300}
                  pathOptions={{ color: "#B84520", fillColor: "#B84520", fillOpacity: 0.1, weight: 1.5 }}
                />
              </MapContainer>
            </div>
            <div className="mt-2.5 flex gap-3">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium underline underline-offset-2"
                style={{ color: "#B84520" }}
              >
                Open in Google Maps →
              </a>
              <span style={{ color: "#D4C9BE" }}>|</span>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium underline underline-offset-2"
                style={{ color: "#C8891A" }}
              >
                Get turn-by-turn directions →
              </a>
            </div>
          </div>

          {/* Landlord + CTA */}
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4"
            style={{ borderTop: "1px solid #E8E0D5" }}
          >
            <div>
              <div style={{ fontSize: "0.75rem", color: "#9CA3AF", marginBottom: 2 }}>Listed by</div>
              <div style={{ fontWeight: 600, color: "#1A1A1A" }}>{p.landlordName}</div>
              <div style={{ fontSize: "0.78rem", color: "#6B7280" }}>
                Typical reply {p.replyTime}
              </div>
            </div>
            <div className="flex gap-3">
              <a
                href="https://wa.me/254757660878"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
                style={{ background: "#25D366", color: "#fff" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
              <button
                onClick={() => setViewingStep("form")}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
                style={{ background: "#B84520", color: "#fff" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
                </svg>
                Request Viewing
              </button>
              {(p.listingType === "sale" || p.listingType === "both") && p.salePriceKES && (
                <button
                  onClick={() => setShowFinance(true)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
                  style={{ background: "linear-gradient(135deg, #0F2419, #1B5E35)", color: "#fff" }}
                >
                  🏦 Get Financing
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

    {galleryOpen && (
      <Gallery
        images={images}
        initialIndex={galleryIndex}
        onClose={() => setGalleryOpen(false)}
      />
    )}

    {/* ── Viewing Request Modal ── */}
    {viewingStep !== "idle" && (
      <div
        className="fixed inset-0 z-[70] flex items-center justify-center px-4"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      >
        <div
          className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
          style={{ background: "#fff", fontFamily: "Outfit, sans-serif" }}
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-5" style={{ background: "linear-gradient(135deg, #B84520, #C95930)" }}>
            <div className="flex items-start justify-between">
              <div>
                <div style={{ fontFamily: "Fraunces, serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.55)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
                  {viewingStep === "confirmed" ? "You're in the queue" : "Schedule a Viewing"}
                </div>
                <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.3rem", color: "#fff", fontWeight: 300, lineHeight: 1.25 }}>
                  {p.estate}
                </div>
                <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.65)", marginTop: 3 }}>
                  {p.area}, {p.city}
                </div>
              </div>
              <button
                onClick={() => { setViewingStep("idle"); setViewingName(""); setViewingPhone("") }}
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}
              >
                ✕
              </button>
            </div>

            {/* Others interested strip */}
            <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.12)" }}>
              <div className="flex -space-x-1.5">
                {[...Array(Math.min(othersCount, 5))].map((_, i) => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold"
                    style={{ background: ["#C8891A","#1B5E35","#B84520","#6B7280","#2D6B4F"][i % 5], color: "#fff", borderColor: "#B84520" }}>
                    {["JK","MW","AN","SO","BM"][i]}
                  </div>
                ))}
              </div>
              <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.85)" }}>
                <strong>{othersCount} people</strong> are also interested in this property
              </span>
            </div>
          </div>

          <div className="p-6">
            {viewingStep === "form" && (
              <>
                <p style={{ fontSize: "0.85rem", color: "#6B7280", marginBottom: 20, lineHeight: 1.6 }}>
                  We bundle viewing slots for interested parties — fewer trips for the landlord, better timing for you. Leave your details and we'll coordinate a shared slot.
                </p>
                <div className="space-y-3">
                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "#4B5563", display: "block", marginBottom: 5 }}>Your Name</label>
                    <input
                      value={viewingName}
                      onChange={(e) => setViewingName(e.target.value)}
                      placeholder="e.g. James Kariuki"
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                      style={{ border: "1.5px solid #E8E0D5", color: "#1A1A1A", background: "#F7F5F1" }}
                      onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#B84520" }}
                      onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "#E8E0D5" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "#4B5563", display: "block", marginBottom: 5 }}>Phone / WhatsApp</label>
                    <input
                      value={viewingPhone}
                      onChange={(e) => setViewingPhone(e.target.value)}
                      placeholder="+254 7XX XXX XXX"
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                      style={{ border: "1.5px solid #E8E0D5", color: "#1A1A1A", background: "#F7F5F1" }}
                      onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#B84520" }}
                      onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "#E8E0D5" }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (!viewingName.trim() || !viewingPhone.trim()) return
                    setViewingStep("queuing")
                    setTimeout(() => setViewingStep("confirmed"), 2800)
                  }}
                  disabled={!viewingName.trim() || !viewingPhone.trim()}
                  className="mt-5 w-full py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: viewingName.trim() && viewingPhone.trim() ? "#B84520" : "#E8E0D5",
                    color: "#fff",
                  }}
                >
                  Join the Viewing Queue →
                </button>
                <p style={{ fontSize: "0.72rem", color: "#9CA3AF", textAlign: "center", marginTop: 10 }}>
                  Our agent will WhatsApp you within 24h with a confirmed slot
                </p>
              </>
            )}

            {viewingStep === "queuing" && (
              <div className="py-8 flex flex-col items-center text-center">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
                  style={{ border: "3px solid #B84520", borderTopColor: "transparent", animation: "spin 0.9s linear infinite" }}
                />
                <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.1rem", color: "#1A1A1A", fontWeight: 400, marginBottom: 8 }}>
                  Compiling visit requests…
                </div>
                <p style={{ fontSize: "0.82rem", color: "#6B7280", lineHeight: 1.65, maxWidth: 280 }}>
                  We're bundling your request with {othersCount} other interested viewers to coordinate the best shared slot.
                </p>
              </div>
            )}

            {viewingStep === "confirmed" && (
              <div className="py-4 flex flex-col items-center text-center">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
                  style={{ background: "#1B5E35" }}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  </svg>
                </div>
                <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.1rem", color: "#1A1A1A", fontWeight: 400, marginBottom: 8 }}>
                  You&apos;re in the queue, {viewingName.split(" ")[0]}!
                </div>
                <p style={{ fontSize: "0.82rem", color: "#6B7280", lineHeight: 1.65, maxWidth: 300 }}>
                  We&apos;ve added you alongside {othersCount} others interested in this property. Our agent will WhatsApp <strong style={{ color: "#1A1A1A" }}>{viewingPhone}</strong> within 24 hours to confirm a bundled viewing slot.
                </p>
                <div
                  className="mt-5 w-full rounded-xl p-4 text-left"
                  style={{ background: "#EEF6F1", border: "1px solid #C8DDD0" }}
                >
                  <div style={{ fontSize: "0.72rem", color: "#1B5E35", fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>What happens next</div>
                  {[
                    "Our agent collects all viewing requests for this property",
                    "A shared timeslot is arranged with the landlord",
                    "You'll be notified via WhatsApp 2 hours before",
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-2.5 mt-2">
                      <span className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold"
                        style={{ background: "#1B5E35", color: "#fff", marginTop: 1 }}>
                        {i + 1}
                      </span>
                      <span style={{ fontSize: "0.8rem", color: "#374151", lineHeight: 1.5 }}>{step}</span>
                    </div>
                  ))}
                </div>
                <a
                  href={`https://wa.me/254757660878?text=Hi! I just requested a viewing for ${encodeURIComponent(p.estate + ", " + p.area + ", " + p.city)}. My name is ${encodeURIComponent(viewingName)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                  style={{ background: "#25D366", color: "#fff" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Confirm on WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )}

    {showFinance && (
      <MortgageCalculator
        onClose={() => setShowFinance(false)}
        prefillPrice={p.salePriceKES}
        prefillEstate={p.estate}
      />
    )}
    </>
  )
}
