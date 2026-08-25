import { useEffect, useRef, useState, type CSSProperties } from "react"
import * as THREE from "three"
import gsap from "gsap"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface Props {
  onComplete: () => void
}

// Three.js SphereGeometry UV convention:
//   phi = (lon+180)/360 * 2π,  theta = (90-lat)/180 * π
//   x = -R·cos(phi)·sin(theta),  y = R·cos(theta),  z = R·sin(phi)·sin(theta)
function latLonToVec3(lat: number, lon: number, r: number): THREE.Vector3 {
  const phi   = ((lon + 180) / 360) * Math.PI * 2
  const theta = ((90  - lat) / 180) * Math.PI
  return new THREE.Vector3(
    -r * Math.cos(phi) * Math.sin(theta),
     r * Math.cos(theta),
     r * Math.sin(phi) * Math.sin(theta),
  )
}

function facingY(v: THREE.Vector3) { return -Math.atan2(v.x, v.z) }

const NBI_LAT = -1.2921
const NBI_LON =  36.8219

const SAT_TILES   = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
const LABEL_TILES = "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"

type Phase = "globe" | "locating" | "locked" | "satellite" | "fading"

export default function GlobeIntro({ onComplete }: Props) {
  const globeRef = useRef<HTMLDivElement>(null)
  const satRef   = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<Phase>("globe")
  const [satLabel, setSatLabel] = useState("Connecting to satellite feed…")
  const [zoom, setZoom] = useState(5)

  useEffect(() => {
    const globeEl = globeRef.current
    const satEl   = satRef.current
    if (!globeEl || !satEl) return

    // ── Three.js renderer ─────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    globeEl.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x020810)
    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 800)
    camera.position.set(0, 1.2, 10)
    camera.lookAt(0, 0, 0)

    // Stars
    const sPts = new Float32Array(16000 * 3)
    for (let i = 0; i < 16000; i++) {
      const r = 100 + Math.random() * 400
      const u = Math.random() * Math.PI * 2
      const v = Math.acos(2 * Math.random() - 1)
      sPts[i*3]   = r * Math.sin(v) * Math.cos(u)
      sPts[i*3+1] = r * Math.sin(v) * Math.sin(u)
      sPts[i*3+2] = r * Math.cos(v)
    }
    const sGeo = new THREE.BufferGeometry()
    sGeo.setAttribute("position", new THREE.BufferAttribute(sPts, 3))
    scene.add(new THREE.Points(sGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.22, sizeAttenuation: true, transparent: true, opacity: 0.75 })))

    // Earth — satellite (Blue Marble day) texture
    const R = 2.3
    const earthMat = new THREE.MeshPhongMaterial({
      color: 0xffffff,      // let texture show through fully
      specular: 0x336688,   // ocean glint
      shininess: 18,
    })
    const earth = new THREE.Mesh(new THREE.SphereGeometry(R, 96, 96), earthMat)
    scene.add(earth)

    // Load satellite day texture — Blue Marble. Try multiple CDNs.
    const loader = new THREE.TextureLoader()
    const tryTex = (urls: string[]) => {
      if (!urls.length) return
      loader.load(
        urls[0],
        (t) => { t.colorSpace = THREE.SRGBColorSpace; earthMat.map = t; earthMat.needsUpdate = true },
        undefined,
        () => tryTex(urls.slice(1)),
      )
    }
    tryTex([
      "https://unpkg.com/three-globe/example/img/earth-day.jpg",
      "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-day.jpg",
      "https://unpkg.com/three-globe@2.31.1/example/img/earth-day.jpg",
    ])

    // Thin atmosphere haze — blue scatter effect
    scene.add(new THREE.Mesh(
      new THREE.SphereGeometry(R + 0.18, 64, 64),
      new THREE.MeshPhongMaterial({ color: 0x4488ff, transparent: true, opacity: 0.06, side: THREE.FrontSide }),
    ))
    // Outer glow rim (back face trick)
    scene.add(new THREE.Mesh(
      new THREE.SphereGeometry(R + 0.55, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0x1a55cc, transparent: true, opacity: 0.032, side: THREE.BackSide }),
    ))

    // Lighting — simulate Sun from upper-right (East Africa in daylight)
    scene.add(new THREE.AmbientLight(0x223355, 1.8))   // dim deep-space fill
    const sun = new THREE.DirectionalLight(0xfff5e0, 5.5)
    sun.position.set(8, 3, 6)
    scene.add(sun)
    // Cool space-side fill — very subtle
    const spaceFill = new THREE.DirectionalLight(0x0022aa, 0.4)
    spaceFill.position.set(-7, -1, -5)
    scene.add(spaceFill)

    // Nairobi marker
    const kVec = latLonToVec3(NBI_LAT, NBI_LON, R)
    const dMat = new THREE.MeshBasicMaterial({ color: 0xF5A623 })
    const dot  = new THREE.Mesh(new THREE.SphereGeometry(0.05,16,16), dMat)
    dot.position.copy(kVec); earth.add(dot)

    const r1Mat = new THREE.MeshBasicMaterial({ color: 0xF5A623, transparent: true, opacity: 0.9, side: THREE.DoubleSide })
    const r1    = new THREE.Mesh(new THREE.RingGeometry(0.08,0.13,48), r1Mat)
    r1.position.copy(kVec); r1.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1), kVec.clone().normalize()); earth.add(r1)

    const r2Mat = new THREE.MeshBasicMaterial({ color: 0xF5A623, transparent: true, opacity: 0.4, side: THREE.DoubleSide })
    const r2    = new THREE.Mesh(new THREE.RingGeometry(0.16,0.22,48), r2Mat)
    r2.position.copy(kVec); r2.quaternion.copy(r1.quaternion); earth.add(r2)

    // Warm glow at Kenya — visible on the satellite surface
    const kLight = new THREE.PointLight(0xffaa44, 1.6, 2.8)
    kLight.position.set(0, NBI_LAT * (Math.PI/180) * R, R+0.35); scene.add(kLight)

    // Earth rotation: Africa center -> Kenya
    const kenyaFacing  = facingY(kVec)
    const africaFacing = facingY(latLonToVec3(2, 20, R))
    earth.rotation.y = africaFacing

    // ── Leaflet satellite ─────────────────────────────────
    let leafMap: L.Map | null = null

    // Called at t=2.0s — builds the map hidden so tiles start loading
    const initSatellite = () => {
      if (leafMap) return
      leafMap = L.map(satEl, {
        center: [-1.0, 37.5],   // wider East Africa start, matches globe framing
        zoom: 5,
        zoomControl: false,
        attributionControl: true,
        keyboard: false,
        dragging: false,
        touchZoom: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
      })
      L.tileLayer(SAT_TILES,   { maxZoom: 19 }).addTo(leafMap)
      L.tileLayer(LABEL_TILES, { maxZoom: 19, opacity: 0.8 }).addTo(leafMap)
      leafMap.invalidateSize()

      leafMap.on("zoom", () => {
        const z = Math.round((leafMap as L.Map).getZoom())
        setZoom(z)
        if (z >= 7)  setSatLabel("Resolving ground detail…")
        if (z >= 11) setSatLabel("Nairobi, Kenya — live imagery")
      })

      const attr = satEl.querySelector(".leaflet-control-attribution") as HTMLElement | null
      if (attr) attr.style.cssText = "background:rgba(0,0,0,0.4);color:rgba(255,255,255,0.28);font-size:9px;padding:2px 6px;"
    }

    // Called at t=4.5s — crossfade is complete, start the zoom
    const startFlyTo = () => {
      setSatLabel("Zooming in…")
      leafMap?.flyTo([NBI_LAT, NBI_LON], 13, { duration: 5.0, easeLinearity: 0.12 })
    }

    // ── GSAP timeline ─────────────────────────────────────
    const tl = gsap.timeline()

    // Globe rotation: Africa -> Kenya (0.4 -> 2.6s)
    tl.to(earth.rotation, { y: kenyaFacing, duration: 2.2, ease: "power2.inOut", delay: 0.4 }, 0)

    // Camera pull toward surface (1.0 -> 4.0s)
    tl.to(camera.position, { x: 0, y: 0.05, z: 4.2, duration: 3.0, ease: "power2.in", onUpdate: () => camera.lookAt(0,0,0) }, 1.0)

    tl.call(() => setPhase("locating"),   [], 1.2)
    tl.call(() => setPhase("locked"),     [], 2.7)

    // Init Leaflet at 2.0s — 2+ seconds of tile preloading before crossfade
    tl.call(() => initSatellite(),        [], 2.0)

    // Crossfade globe → satellite at 4.2s (tiles have had 2.2s to load)
    tl.call(() => setPhase("satellite"),  [], 4.2)

    // FlyTo starts at 4.5s — crossfade transition (1.8s) is still running but
    // satellite is already majority visible, so zoom feels continuous
    tl.call(() => startFlyTo(),           [], 4.5)

    // onComplete at 11.5s — flyTo(5s) + 2s at full zoom to appreciate Nairobi
    tl.call(() => onComplete(),           [], 11.5)

    // ── Render loop ───────────────────────────────────────
    let raf: number
    let running = true
    const t0 = performance.now()

    const tick = () => {
      if (!running) return
      raf = requestAnimationFrame(tick)
      const t = (performance.now() - t0) / 1000
      scene.rotation.y = t * 0.003
      const p1 = (t * 1.7) % 1
      r1.scale.setScalar(1 + p1 * 1.6); r1Mat.opacity = 0.9 * (1 - p1)
      const p2 = ((t * 1.7 + 0.5) % 1)
      r2.scale.setScalar(1 + p2 * 2.4); r2Mat.opacity = 0.45 * (1 - p2)
      dot.scale.setScalar(1 + Math.sin(t * 3.8) * 0.22)
      renderer.render(scene, camera)
    }
    tick()

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      leafMap?.invalidateSize()
    }
    window.addEventListener("resize", onResize)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      tl.kill()
      window.removeEventListener("resize", onResize)
      if (globeEl.contains(renderer.domElement)) globeEl.removeChild(renderer.domElement)
      renderer.dispose()
      leafMap?.remove()
    }
  }, [onComplete])

  const inGlobePhase = phase === "globe" || phase === "locating" || phase === "locked"
  const globeOpacity = inGlobePhase ? 1 : 0
  const satOpacity   = phase === "satellite" ? 1 : 0

  return (
    <div className="fixed inset-0" style={{ background: "#000" }}>

      {/* ── Globe (Three.js) — fades out when satellite is ready ── */}
      <div
        ref={globeRef}
        className="absolute inset-0"
        style={{ opacity: globeOpacity, transition: "opacity 1.8s ease" }}
      />

      {/* ── Satellite (Leaflet) — fades in only after tiles loaded ── */}
      <div
        ref={satRef}
        className="absolute inset-0"
        style={{ opacity: satOpacity, transition: "opacity 1.8s ease" }}
      />

      {/* ── Satellite HUD ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: satOpacity, transition: "opacity 1.8s ease" }}
      >
        {/* Top-left: live badge */}
        <div
          className="absolute top-5 left-5 flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(10px)", border: "1px solid rgba(74,222,128,0.3)" }}
        >
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ background: "#4ADE80", boxShadow: "0 0 8px #4ADE80", animation: "livePulse 1.4s ease-in-out infinite" }}
          />
          <span style={{ fontSize: "0.65rem", color: "rgba(74,222,128,0.9)", fontFamily: "Outfit, sans-serif", letterSpacing: "0.18em", textTransform: "uppercase" }}>
            Live Satellite
          </span>
        </div>

        {/* Top-right: zoom + coords */}
        <div
          className="absolute top-5 right-5 text-right"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 14px" }}
        >
          <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.35)", fontFamily: "monospace", letterSpacing: "0.1em" }}>
            ZOOM {zoom} &middot; ESRI World Imagery
          </div>
          <div style={{ fontSize: "0.68rem", color: "rgba(245,166,35,0.7)", fontFamily: "monospace", letterSpacing: "0.1em", marginTop: 3 }}>
            {NBI_LAT.toFixed(4)}&deg; S &middot; {NBI_LON.toFixed(4)}&deg; E
          </div>
        </div>

        {/* Crosshair */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div style={{ position: "absolute", width: 32, height: 1, background: "rgba(245,166,35,0.55)", left: -44, top: 0 }} />
            <div style={{ position: "absolute", width: 32, height: 1, background: "rgba(245,166,35,0.55)", right: -44, top: 0 }} />
            <div style={{ position: "absolute", height: 32, width: 1, background: "rgba(245,166,35,0.55)", top: -44, left: 0 }} />
            <div style={{ position: "absolute", height: 32, width: 1, background: "rgba(245,166,35,0.55)", bottom: -44, left: 0 }} />
            <div style={{ width: 9, height: 9, borderRadius: "50%", border: "2px solid #F5A623", background: "rgba(245,166,35,0.28)" }} />
          </div>
        </div>

        {/* Bottom status */}
        <div className="absolute bottom-7 left-0 right-0 flex flex-col items-center gap-2">
          <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.4)", fontFamily: "Outfit, sans-serif", letterSpacing: "0.14em" }}>
            {satLabel}
          </div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: "1rem", color: "rgba(255,255,255,0.18)", fontWeight: 300, letterSpacing: "0.2em" }}>
            Maskani<span style={{ color: "rgba(245,166,35,0.3)" }}>Hub</span>
          </div>
        </div>

        {/* Corner brackets */}
        {([
          { top: 16, left: 16,   borderTop: "2px solid rgba(245,166,35,0.35)", borderLeft:   "2px solid rgba(245,166,35,0.35)" },
          { top: 16, right: 16,  borderTop: "2px solid rgba(245,166,35,0.35)", borderRight:  "2px solid rgba(245,166,35,0.35)" },
          { bottom: 16, left: 16,  borderBottom: "2px solid rgba(245,166,35,0.35)", borderLeft:   "2px solid rgba(245,166,35,0.35)" },
          { bottom: 16, right: 16, borderBottom: "2px solid rgba(245,166,35,0.35)", borderRight:  "2px solid rgba(245,166,35,0.35)" },
        ] as CSSProperties[]).map((s, i) => (
          <div key={i} className="absolute" style={{ ...s, width: 20, height: 20 }} />
        ))}
      </div>

      {/* ── Globe overlay (locating / locked callout) ── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-end pb-20 pointer-events-none"
        style={{ opacity: (phase === "locating" || phase === "locked") ? 1 : 0, transition: "opacity 0.5s ease" }}
      >
        {/* Scanning pill */}
        <div
          className="flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full"
          style={{ border: "1px solid rgba(245,166,35,0.3)", background: "rgba(245,166,35,0.06)", backdropFilter: "blur(8px)", opacity: phase === "locating" ? 1 : 0, transition: "opacity 0.4s ease" }}
        >
          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#F5A623", animation: "locPulse 1.1s ease-out infinite" }} />
          <span style={{ fontSize: "0.68rem", color: "rgba(245,166,35,0.85)", fontFamily: "Outfit, sans-serif", letterSpacing: "0.22em", textTransform: "uppercase" }}>Locating</span>
        </div>

        {/* Location card */}
        <div style={{ background: "rgba(2,8,16,0.82)", backdropFilter: "blur(16px)", border: "1px solid rgba(245,166,35,0.22)", borderRadius: 24, padding: "24px 44px 20px", textAlign: "center", transform: phase === "locked" ? "translateY(0)" : "translateY(8px)", transition: "transform 0.5s ease" }}>
          <div className="font-mono" style={{ fontSize: "0.65rem", color: "rgba(245,166,35,0.4)", letterSpacing: "0.18em", marginBottom: 10 }}>
            {phase === "locating" ? "── SCANNING EAST AFRICA ──" : `${NBI_LAT}° S  ·  ${NBI_LON}° E`}
          </div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: "clamp(2.2rem,6vw,3.4rem)", color: "#fff", fontWeight: 300, letterSpacing: "0.12em", lineHeight: 1, textShadow: "0 0 40px rgba(245,166,35,0.2)" }}>
            Kenya
          </div>
          <div style={{ height: 1, background: "rgba(245,166,35,0.18)", margin: "14px auto", width: 44 }} />
          <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", fontFamily: "Outfit, sans-serif", letterSpacing: "0.14em", textTransform: "uppercase" }}>East Africa</div>
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#4ADE80" }} />
            <span style={{ fontSize: "0.62rem", color: "rgba(74,222,128,0.65)", fontFamily: "Outfit, sans-serif", letterSpacing: "0.14em", textTransform: "uppercase" }}>Maskani Hub</span>
          </div>
        </div>
      </div>

      {/* ── Skip ── */}
      {phase !== "satellite" && (
        <button
          onClick={onComplete}
          className="absolute top-5 right-6"
          style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.25)", fontFamily: "Outfit, sans-serif", letterSpacing: "0.16em", textTransform: "uppercase" }}
        >
          Skip &rarr;
        </button>
      )}

      <style>{`
        @keyframes locPulse  { 0%,100%{opacity:1;transform:scale(1)}60%{opacity:0;transform:scale(2.4)} }
        @keyframes livePulse { 0%,100%{opacity:1}50%{opacity:0.4} }
      `}</style>
    </div>
  )
}
