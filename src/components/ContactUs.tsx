interface Props {
  onClose: () => void
}

export default function ContactUs({ onClose }: Props) {
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
          style={{ background: "linear-gradient(135deg, #B84520 0%, #C95930 100%)" }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
            style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}
          >
            ✕
          </button>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
            Get in Touch
          </div>
          <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "2rem", color: "#fff", fontWeight: 300, lineHeight: 1.2 }}>
            Contact <em style={{ color: "#C8891A" }}>Maskani Hub</em>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 10, fontSize: "0.9rem", lineHeight: 1.6 }}>
            Our listings team is ready to help you find your next home or list your property. Reach us directly below.
          </p>
        </div>

        {/* Contact cards */}
        <div className="p-8 space-y-4">

          {/* Phone */}
          <a
            href="tel:+254757660878"
            className="flex items-center gap-5 p-5 rounded-2xl transition-all group"
            style={{ background: "#F7F5F1", border: "1px solid #E8E0D5" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#B84520"; (e.currentTarget as HTMLElement).style.background = "#FBF0EC" }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#E8E0D5"; (e.currentTarget as HTMLElement).style.background = "#F7F5F1" }}
          >
            <div
              className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: "#B84520" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
            </div>
            <div className="flex-1">
              <div style={{ fontSize: "0.75rem", color: "#9CA3AF", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>Phone / WhatsApp</div>
              <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#B84520", fontFamily: "Fraunces, serif" }}>+254 757 660 878</div>
              <div style={{ fontSize: "0.8rem", color: "#6B7280", marginTop: 2 }}>Available Mon–Sat · 8 AM – 7 PM EAT</div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B84520" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/254757660878"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-5 p-5 rounded-2xl transition-all"
            style={{ background: "#F0FDF4", border: "1px solid #86EFAC" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#DCFCE7" }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#F0FDF4" }}
          >
            <div
              className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: "#25D366" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <div className="flex-1">
              <div style={{ fontSize: "0.75rem", color: "#16A34A", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>WhatsApp Chat</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#15803D" }}>Chat with us instantly</div>
              <div style={{ fontSize: "0.8rem", color: "#4ADE80", marginTop: 2 }}>Fastest response channel</div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>

          {/* Email */}
          <a
            href="mailto:Belllistings@maskanihub.com"
            className="flex items-center gap-5 p-5 rounded-2xl transition-all"
            style={{ background: "#F7F5F1", border: "1px solid #E8E0D5" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#C8891A"; (e.currentTarget as HTMLElement).style.background = "#FFF8EE" }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#E8E0D5"; (e.currentTarget as HTMLElement).style.background = "#F7F5F1" }}
          >
            <div
              className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: "#C8891A" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </div>
            <div className="flex-1">
              <div style={{ fontSize: "0.75rem", color: "#9CA3AF", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>Email</div>
              <div style={{ fontSize: "1rem", fontWeight: 700, color: "#C8891A" }}>Belllistings@maskanihub.com</div>
              <div style={{ fontSize: "0.8rem", color: "#6B7280", marginTop: 2 }}>We reply within 24 hours</div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C8891A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>

          {/* Divider */}
          <div className="pt-2 pb-1" style={{ borderTop: "1px solid #E8E0D5" }} />

          {/* Info row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl p-4" style={{ background: "#F7F5F1" }}>
              <div style={{ fontSize: "0.75rem", color: "#9CA3AF", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Office</div>
              <div style={{ fontSize: "0.85rem", color: "#1A1A1A", fontWeight: 500 }}>Nairobi, Kenya</div>
              <div style={{ fontSize: "0.8rem", color: "#6B7280", marginTop: 2 }}>Serving all counties</div>
            </div>
            <div className="rounded-xl p-4" style={{ background: "#F7F5F1" }}>
              <div style={{ fontSize: "0.75rem", color: "#9CA3AF", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Listings team</div>
              <div style={{ fontSize: "0.85rem", color: "#1A1A1A", fontWeight: 500 }}>Bell Listings</div>
              <div style={{ fontSize: "0.8rem", color: "#6B7280", marginTop: 2 }}>Verified property advisors</div>
            </div>
          </div>

          {/* List property CTA */}
          <div
            className="rounded-2xl p-5 flex items-center justify-between gap-4"
            style={{ background: "linear-gradient(135deg, #B84520, #C95930)" }}
          >
            <div>
              <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.05rem", color: "#fff", fontWeight: 400 }}>
                Want to list your property?
              </div>
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.65)", marginTop: 4 }}>
                Reach thousands of tenants and buyers across Kenya
              </div>
            </div>
            <a
              href="mailto:Belllistings@maskanihub.com?subject=List My Property on Maskani Hub"
              className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ background: "#C8891A", color: "#fff" }}
            >
              Get Listed →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
