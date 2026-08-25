import { useState, useEffect } from "react"
import { useTheme } from "../context/ThemeContext"
import {
  signInGoogleRedirect,
  checkRedirectResult,
  signInEmail,
  signUpEmail,
} from "../lib/firebase"

interface Props {
  onClose: () => void
  onAuth: (user: { name: string; email: string; avatar?: string }) => void
}

type Mode = "signin" | "signup"

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

function Spinner({ color }: { color: string }) {
  return (
    <span style={{ width: 17, height: 17, border: `2px solid ${color}33`, borderTopColor: color, borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
  )
}

export default function AuthModal({ onClose, onAuth }: Props) {
  const { dark } = useTheme()
  const [mode, setMode] = useState<Mode>("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState<"google" | "email" | null>(null)
  const [error, setError] = useState("")

  const cardBg        = dark ? "#111111" : "#FFFFFF"
  const inputBg       = dark ? "#1A1A1A" : "#F7F5F1"
  const border        = dark ? "#222222" : "#E8E0D5"
  const textPrimary   = dark ? "#F0ECE6" : "#1A1A1A"
  const textSecondary = dark ? "#8A8A8A" : "#6B7280"

  // Pick up the user after Google redirect returns
  useEffect(() => {
    setLoading("google")
    checkRedirectResult()
      .then((user) => {
        if (user) { onAuth(user); onClose() }
      })
      .catch((e: unknown) => {
        const msg = e instanceof Error ? e.message : ""
        if (msg.includes("auth/unauthorized-continue-uri") || msg.includes("unauthorized") || msg.includes("domain")) {
          setError(`Add this domain to Firebase → Authentication → Settings → Authorized domains:\n${window.location.hostname}`)
        }
      })
      .finally(() => setLoading(null))
  }, [])

  const handleGoogle = async () => {
    setError("")
    setLoading("google")
    try {
      await signInGoogleRedirect()
      // Page will redirect — loading state stays until return
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : ""
      if (msg.includes("unauthorized") || msg.includes("domain")) {
        setError(`Add this domain to Firebase → Authentication → Settings → Authorized domains:\n${window.location.hostname}`)
      } else {
        setError(msg || "Google sign-in failed.")
      }
      setLoading(null)
    }
  }

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError("Please fill in all fields."); return }
    if (mode === "signup" && !name) { setError("Please enter your name."); return }
    setLoading("email"); setError("")
    try {
      const user = mode === "signup"
        ? await signUpEmail(email, password, name)
        : await signInEmail(email, password)
      onAuth(user)
      onClose()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Authentication failed.")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="relative w-full overflow-hidden rounded-3xl shadow-2xl flex"
        style={{ maxWidth: 860, minHeight: 540, fontFamily: "Outfit, sans-serif" }}
      >
        {/* Left brand panel */}
        <div
          className="hidden md:flex flex-col justify-between p-10 flex-shrink-0"
          style={{ width: 340, background: "linear-gradient(160deg, #0F2419 0%, #1B5E35 55%, #2D4A1E 100%)", position: "relative", overflow: "hidden" }}
        >
          <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />
          <div style={{ position: "absolute", bottom: -40, left: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(184,69,32,0.12)" }} />

          <div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.5rem", color: "#fff", fontWeight: 300 }}>
              Maskani<span style={{ color: "#C8891A" }}>Hub</span>
            </div>
            <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.14em", marginTop: 4, textTransform: "uppercase" }}>
              Kenya&apos;s Property Marketplace
            </div>
          </div>

          <div>
            <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "clamp(1.6rem,3vw,2rem)", color: "#fff", fontWeight: 300, lineHeight: 1.25, marginBottom: 16 }}>
              Your home search,{" "}<em style={{ color: "#C8891A" }}>personalised</em>
            </h2>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
              Save listings, track price changes, and get alerts when new properties match your search.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { icon: "🔒", text: "Secure, encrypted login" },
              { icon: "🏡", text: "Save unlimited favourites" },
              { icon: "🔔", text: "Instant listing alerts" },
            ].map((t) => (
              <div key={t.text} className="flex items-center gap-3">
                <span>{t.icon}</span>
                <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>{t.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right form panel */}
        <div className="flex-1 flex flex-col justify-center px-8 py-10" style={{ background: cardBg }}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: dark ? "#1A1A1A" : "#F7F5F1", color: textSecondary }}
          >
            ✕
          </button>

          <div className="flex gap-1 mb-8 p-1 rounded-xl self-start" style={{ background: dark ? "#1A1A1A" : "#F3F4F6" }}>
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError("") }}
                className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: mode === m ? (dark ? "#2A2A2A" : "#FFFFFF") : "transparent",
                  color: mode === m ? textPrimary : textSecondary,
                  boxShadow: mode === m ? "0 1px 4px rgba(0,0,0,0.12)" : "none",
                }}
              >
                {m === "signin" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <h3 style={{ fontFamily: "Fraunces, serif", fontSize: "1.55rem", color: textPrimary, fontWeight: 300, marginBottom: 6 }}>
            {mode === "signin" ? "Welcome back" : "Join Maskani Hub"}
          </h3>
          <p style={{ fontSize: "0.83rem", color: textSecondary, marginBottom: 28, lineHeight: 1.6 }}>
            {mode === "signin" ? "Sign in to access your saved searches and alerts." : "Create a free account to save listings and get alerts."}
          </p>

          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={loading !== null}
            className="flex items-center justify-center gap-3 w-full py-3 rounded-2xl text-sm font-semibold mb-6 transition-all"
            style={{ background: dark ? "#1A1A1A" : "#FFFFFF", border: `1.5px solid ${border}`, color: textPrimary, opacity: loading === "email" ? 0.45 : 1 }}
          >
            {loading === "google" ? <Spinner color="#4285F4" /> : <GoogleLogo />}
            {loading === "google" ? "Redirecting to Google…" : "Continue with Google"}
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1" style={{ height: 1, background: border }} />
            <span style={{ fontSize: "0.72rem", color: textSecondary, letterSpacing: "0.06em" }}>or with email</span>
            <div className="flex-1" style={{ height: 1, background: border }} />
          </div>

          <form onSubmit={handleEmail} className="flex flex-col gap-3">
            {mode === "signup" && (
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: textSecondary, display: "block", marginBottom: 6, letterSpacing: "0.04em" }}>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Amina Wanjiru"
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                  style={{ background: inputBg, border: `1.5px solid ${border}`, color: textPrimary }}
                />
              </div>
            )}

            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: 600, color: textSecondary, display: "block", marginBottom: 6, letterSpacing: "0.04em" }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                style={{ background: inputBg, border: `1.5px solid ${border}`, color: textPrimary }}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: textSecondary, letterSpacing: "0.04em" }}>Password</label>
                {mode === "signin" && (
                  <button type="button" style={{ fontSize: "0.72rem", color: "#B84520" }}>Forgot password?</button>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                style={{ background: inputBg, border: `1.5px solid ${border}`, color: textPrimary }}
              />
            </div>

            {error && (
              <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "rgba(184,69,32,0.1)", color: "#B84520", border: "1px solid rgba(184,69,32,0.2)", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading !== null}
              className="w-full py-3 rounded-2xl text-sm font-semibold mt-1 flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, #B84520, #C95930)", color: "#fff", opacity: loading ? 0.7 : 1 }}
            >
              {loading === "email" ? (
                <><Spinner color="#fff" /> {mode === "signin" ? "Signing in…" : "Creating account…"}</>
              ) : (
                mode === "signin" ? "Sign In →" : "Create Account →"
              )}
            </button>
          </form>

          <p style={{ fontSize: "0.68rem", color: textSecondary, marginTop: 18, lineHeight: 1.6, textAlign: "center" }}>
            By continuing you agree to Maskani Hub&apos;s{" "}
            <span style={{ color: "#B84520", cursor: "pointer" }}>Terms of Service</span>{" "}and{" "}
            <span style={{ color: "#B84520", cursor: "pointer" }}>Privacy Policy</span>.
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
