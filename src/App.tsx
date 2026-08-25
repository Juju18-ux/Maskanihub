import { useState, useCallback, useRef } from "react"
import GlobeIntro from "./components/GlobeIntro"
import MainApp from "./components/MainApp"

export default function App() {
  const [showApp, setShowApp] = useState(false)
  const [flashing, setFlashing] = useState(false)
  const doneRef = useRef(false)

  const handleGlobeComplete = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    setFlashing(true)
    setTimeout(() => {
      setShowApp(true)
      setTimeout(() => setFlashing(false), 400)
    }, 500)
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: "#020814" }}>
      {/* Globe stays mounted until app is visible to avoid remount flicker */}
      {!showApp && <GlobeIntro onComplete={handleGlobeComplete} />}

      {showApp && <MainApp />}

      {/* EA FC-style radial flash overlay */}
      {flashing && (
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            zIndex: 200,
            background:
              "radial-gradient(ellipse at center, #ffffff 0%, rgba(232,164,53,0.5) 35%, transparent 72%)",
            animation: "flare-in 0.35s ease-out forwards, flare-out 0.45s ease-in 0.3s forwards",
          }}
        />
      )}
    </div>
  )
}
