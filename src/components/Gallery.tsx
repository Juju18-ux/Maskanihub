import { useEffect, useCallback, useState, useRef } from "react"

interface Props {
  images: string[]
  initialIndex?: number
  onClose: () => void
}

export default function Gallery({ images, initialIndex = 0, onClose }: Props) {
  const [current, setCurrent] = useState(initialIndex)
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + images.length) % images.length),
    [images.length],
  )
  const next = useCallback(
    () => setCurrent((c) => (c + 1) % images.length),
    [images.length],
  )

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    window.addEventListener("keydown", handler)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", handler)
      document.body.style.overflow = ""
    }
  }, [onClose, prev, next])

  // Touch swipe handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current
    // Only act on predominantly horizontal swipes
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      dx < 0 ? next() : prev()
    }
    touchStartX.current = null
    touchStartY.current = null
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col select-none"
      style={{ background: "rgba(0,0,0,0.97)" }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-5 py-3 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-3">
          <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.9rem", fontFamily: "Fraunces, serif", fontWeight: 400 }}>
            {current + 1}
          </span>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.85rem" }}>/</span>
          <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.85rem", fontFamily: "Outfit, sans-serif" }}>
            {images.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Prev/next on mobile top bar */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}
                aria-label="Previous image"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              <button
                onClick={next}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}
                aria-label="Next image"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}
            aria-label="Close gallery"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Main image area ── */}
      <div className="flex-1 flex items-center justify-center relative min-h-0">
        {/* Clickable half-zones for prev/next — sit behind the image */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute inset-y-0 left-0 z-10 flex items-center justify-start pl-4"
              style={{ width: "50%", background: "transparent" }}
              aria-label="Previous image"
            />
            <button
              onClick={next}
              className="absolute inset-y-0 right-0 z-10 flex items-center justify-end pr-4"
              style={{ width: "50%", background: "transparent" }}
              aria-label="Next image"
            />
          </>
        )}

        {/* Image */}
        <img
          key={current}
          src={images[current]}
          alt={`Photo ${current + 1} of ${images.length}`}
          className="relative z-20 rounded-xl pointer-events-none"
          style={{
            maxWidth: "calc(100% - 120px)",
            maxHeight: "100%",
            objectFit: "contain",
            animation: "fade-up 0.18s ease-out both",
          }}
        />

        {/* Large side arrows — visible on desktop, hidden behind half-zone on mobile */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 hidden md:flex items-center justify-center rounded-full transition-all"
              style={{
                width: 52, height: 52,
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.25)" }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)" }}
              aria-label="Previous image"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 hidden md:flex items-center justify-center rounded-full transition-all"
              style={{
                width: 52, height: 52,
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.25)" }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)" }}
              aria-label="Next image"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </>
        )}
      </div>

      {/* ── Thumbnail strip ── */}
      {images.length > 1 && (
        <div
          className="flex-shrink-0 py-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div
            className="flex items-center gap-2 overflow-x-auto px-4"
            style={{ scrollbarWidth: "none" }}
          >
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="flex-shrink-0 rounded-lg overflow-hidden transition-all"
                style={{
                  width: 68,
                  height: 48,
                  opacity: i === current ? 1 : 0.4,
                  outline: i === current ? "2px solid #B84520" : "2px solid transparent",
                  outlineOffset: 2,
                  transform: i === current ? "scale(1.06)" : "scale(1)",
                  transition: "all 0.15s ease",
                }}
                aria-label={`View photo ${i + 1}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          {/* Swipe hint on mobile */}
          <p className="md:hidden text-center mt-2" style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", fontFamily: "Outfit, sans-serif" }}>
            Swipe or tap sides to navigate
          </p>
        </div>
      )}
    </div>
  )
}
