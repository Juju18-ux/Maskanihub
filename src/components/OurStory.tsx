interface Props {
  onClose: () => void
}

export default function OurStory({ onClose }: Props) {
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
          style={{ background: "linear-gradient(135deg, #1B5E35 0%, #2D6B4F 100%)" }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}
          >
            ✕
          </button>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.55)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
            Our Story
          </div>
          <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "2rem", color: "#fff", fontWeight: 300, lineHeight: 1.2 }}>
            Built for{" "}
            <em style={{ color: "#C8891A" }}>Kenya,</em>
            {" "}by Kenyans
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 10, fontSize: "0.9rem", lineHeight: 1.65 }}>
            Maskani Hub started with a simple frustration — finding a decent home in Kenya was harder than it needed to be.
          </p>
        </div>

        <div className="p-8 space-y-8">
          {/* Origin story */}
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
              style={{ background: "#EEF6F1", color: "#1B5E35" }}
            >
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#1B5E35" }} />
              How it started
            </div>
            <p style={{ color: "#4B5563", lineHeight: 1.75, fontSize: "0.9rem" }}>
              In 2022, our founder — a young professional relocating from Eldoret to Nairobi — spent three weeks calling broker after broker, only to find overpriced listings, misleading photos, and hidden agent fees. That experience planted a seed.
            </p>
            <p style={{ color: "#4B5563", lineHeight: 1.75, fontSize: "0.9rem", marginTop: 12 }}>
              Maskani Hub launched as a curated, direct-to-landlord platform. No middlemen. No inflated fees. Just real homes, real prices — listed in KES and USD so the Kenyan diaspora could plan from abroad.
            </p>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "#E8E0D5" }} />

          {/* Values grid */}
          <div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.1rem", color: "#1A1A1A", fontWeight: 400, marginBottom: 16 }}>
              What we stand for
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: "🏡", title: "Transparency", desc: "Every price, every photo, every amenity — verified before it goes live." },
                { icon: "🌍", title: "Nationwide reach", desc: "From Nyali Beach to Eldoret highlands. Every county matters to us." },
                { icon: "💬", title: "Direct access", desc: "Talk to the actual landlord or caretaker — no call centre filters." },
                { icon: "🤝", title: "Community first", desc: "We give back 2% of listing fees to local community housing projects." },
              ].map((v) => (
                <div
                  key={v.title}
                  className="rounded-xl p-4"
                  style={{ background: "#F7F5F1", border: "1px solid #E8E0D5" }}
                >
                  <div style={{ fontSize: "1.4rem", marginBottom: 6 }}>{v.icon}</div>
                  <div style={{ fontWeight: 600, color: "#1A1A1A", fontSize: "0.9rem", marginBottom: 4 }}>{v.title}</div>
                  <div style={{ fontSize: "0.8rem", color: "#6B7280", lineHeight: 1.6 }}>{v.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ height: 1, background: "#E8E0D5" }} />

          {/* Bell Listings team */}
          <div
            className="rounded-2xl p-6 flex items-center gap-5"
            style={{ background: "linear-gradient(135deg, #EEF6F1, #F7F5F1)" , border: "1px solid #C8DDD0" }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl"
              style={{ background: "#1B5E35" }}
            >
              🔔
            </div>
            <div>
              <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.05rem", color: "#1A1A1A", fontWeight: 400 }}>Bell Listings — Our Verified Partners</div>
              <div style={{ fontSize: "0.82rem", color: "#6B7280", marginTop: 4, lineHeight: 1.6 }}>
                Bell Listings is our primary property advisory team, based in Nairobi with agents across all major cities. Every listing they post is physically inspected before going live.
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { val: "213+", label: "Active Listings" },
              { val: "12", label: "Cities Covered" },
              { val: "2022", label: "Founded" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl py-4" style={{ background: "#F7F5F1" }}>
                <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.6rem", color: "#B84520", fontWeight: 300 }}>{s.val}</div>
                <div style={{ fontSize: "0.72rem", color: "#9CA3AF", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div
            className="rounded-2xl p-5 flex items-center justify-between gap-4"
            style={{ background: "linear-gradient(135deg, #1B5E35, #2D6B4F)" }}
          >
            <div>
              <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.05rem", color: "#fff", fontWeight: 400 }}>
                Ready to find your maskani?
              </div>
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.65)", marginTop: 4 }}>
                Browse 200+ verified listings across Kenya
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: "#C8891A", color: "#fff" }}
            >
              View Listings →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
