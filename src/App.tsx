import { useState, useCallback, useRef } from "react"
import GlobeIntro from "./components/GlobeIntro"
import MainApp from "./components/MainApp"
import { ThemeProvider } from "./context/ThemeContext"

export default function App() {
  const [showApp, setShowApp] = useState(false)
  const doneRef = useRef(false)

  const handleGlobeComplete = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    setShowApp(true)
  }, [])

  return (
    <ThemeProvider>
    <div className="relative w-full h-screen overflow-hidden" style={{ background: "#020814" }}>
      {/* Globe stays mounted until app is visible to avoid remount flicker */}
      {!showApp && <GlobeIntro onComplete={handleGlobeComplete} />}

      {showApp && <MainApp />}
    </div>
    </ThemeProvider>
  )
}
