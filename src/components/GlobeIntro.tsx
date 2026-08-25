import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import gsap from "gsap"

interface Props {
  onComplete: () => void
}

// Three.js SphereGeometry UV convention:
//   u = (lon+180)/360  →  phi = u * 2PI
//   v = (90-lat)/180   →  theta = v * PI
//   x = -R * cos(phi) * sin(theta)
//   y =  R * cos(theta)
//   z =  R * sin(phi) * sin(theta)
function latLonToVec3(lat: number, lon: number, r: number): THREE.Vector3 {
  const phi = ((lon + 180) / 360) * Math.PI * 2
  const theta = ((90 - lat) / 180) * Math.PI
  return new THREE.Vector3(
    -r * Math.cos(phi) * Math.sin(theta),
    r * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
  )
}

// Rotation around Y that brings a local XZ vector to face +Z
function facingRotation(v: THREE.Vector3): number {
  return -Math.atan2(v.x, v.z)
}

export default function GlobeIntro({ onComplete }: Props) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<"hidden" | "locating" | "locked" | "fading">("hidden")

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // ── Renderer ──────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x020810)

    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 800)
    // Start far back, slightly above equator, camera centered
    camera.position.set(0, 1.2, 10)
    camera.lookAt(0, 0, 0)

    // ── Stars ─────────────────────────────────────────────
    const starCount = 16000
    const starPositions = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      const r = 100 + Math.random() * 400
      const u = Math.random() * Math.PI * 2
      const v = Math.acos(2 * Math.random() - 1)
      starPositions[i * 3]     = r * Math.sin(v) * Math.cos(u)
      starPositions[i * 3 + 1] = r * Math.sin(v) * Math.sin(u)
      starPositions[i * 3 + 2] = r * Math.cos(v)
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3))
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.22, sizeAttenuation: true, transparent: true, opacity: 0.75 })
    scene.add(new THREE.Points(starGeo, starMat))

    // ── Earth ─────────────────────────────────────────────
    const R = 2.3
    const earthGeo = new THREE.SphereGeometry(R, 80, 80)
    const earthMat = new THREE.MeshPhongMaterial({
      color: 0x1d4d7a,
      emissive: 0x040e1e,
      emissiveIntensity: 1,
      specular: 0x112244,
      shininess: 10,
    })
    const earth = new THREE.Mesh(earthGeo, earthMat)
    scene.add(earth)

    // Attempt texture load — try two CDNs, fallback to procedural look
    const loader = new THREE.TextureLoader()
    const tryTexture = (urls: string[]) => {
      if (!urls.length) return
      loader.load(urls[0], (t) => { earthMat.map = t; earthMat.needsUpdate = true }, undefined, () => tryTexture(urls.slice(1)))
    }
    tryTexture([
      "https://unpkg.com/three-globe/example/img/earth-dark.jpg",
      "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-dark.jpg",
    ])

    // Fine lat/lon grid
    earth.add(new THREE.Mesh(
      new THREE.SphereGeometry(R + 0.01, 36, 18),
      new THREE.MeshBasicMaterial({ color: 0x3a7ab0, wireframe: true, transparent: true, opacity: 0.055 }),
    ))

    // Atmosphere (front face)
    scene.add(new THREE.Mesh(
      new THREE.SphereGeometry(R + 0.2, 64, 64),
      new THREE.MeshPhongMaterial({ color: 0x0055dd, transparent: true, opacity: 0.075, side: THREE.FrontSide }),
    ))

    // Glow halo (back face)
    scene.add(new THREE.Mesh(
      new THREE.SphereGeometry(R + 0.6, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0x0033aa, transparent: true, opacity: 0.028, side: THREE.BackSide }),
    ))

    // ── Lighting ──────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x112244, 4.5))
    const sun = new THREE.DirectionalLight(0xfff2e0, 4.2)
    sun.position.set(7, 3, 5)
    scene.add(sun)
    const rimLight = new THREE.DirectionalLight(0x0033cc, 0.9)
    rimLight.position.set(-6, 1, -5)
    scene.add(rimLight)

    // ── Kenya / Nairobi marker ─────────────────────────────
    // Nairobi: 1.2921°S, 36.8219°E
    const KENYA_LAT = -1.2921
    const KENYA_LON = 36.8219

    const kenyaVec = latLonToVec3(KENYA_LAT, KENYA_LON, R)

    // Core dot
    const dotMat = new THREE.MeshBasicMaterial({ color: 0xF5A623 })
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), dotMat)
    dot.position.copy(kenyaVec)
    earth.add(dot)

    // Pulse ring A
    const rMat1 = new THREE.MeshBasicMaterial({ color: 0xF5A623, transparent: true, opacity: 0.9, side: THREE.DoubleSide })
    const ring1 = new THREE.Mesh(new THREE.RingGeometry(0.08, 0.13, 48), rMat1)
    ring1.position.copy(kenyaVec)
    ring1.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), kenyaVec.clone().normalize())
    earth.add(ring1)

    // Pulse ring B (larger, offset phase)
    const rMat2 = new THREE.MeshBasicMaterial({ color: 0xF5A623, transparent: true, opacity: 0.4, side: THREE.DoubleSide })
    const ring2 = new THREE.Mesh(new THREE.RingGeometry(0.16, 0.22, 48), rMat2)
    ring2.position.copy(kenyaVec)
    ring2.quaternion.copy(ring1.quaternion)
    earth.add(ring2)

    // Warm point light in world space (Kenya will face +Z after rotation)
    const kenyaPointLight = new THREE.PointLight(0xF5A623, 2.8, 3.2)
    kenyaPointLight.position.set(0, KENYA_LAT * (Math.PI / 180) * R, R + 0.45)
    scene.add(kenyaPointLight)

    // ── Earth rotation to face Kenya ───────────────────────
    // Compute the Y rotation that brings kenyaVec.xz to the +Z axis
    const kenyaFacing = facingRotation(kenyaVec)  // ≈ −2.21 rad for Nairobi

    // Start with central Africa facing camera (lon≈20°E), then animate to Kenya
    const africaVec = latLonToVec3(2, 20, R)
    const africaFacing = facingRotation(africaVec)
    earth.rotation.y = africaFacing   // Africa centred on load

    // ── GSAP timeline ─────────────────────────────────────
    const tl = gsap.timeline()

    // Phase 1: slow globe rotation — Africa → Kenya lock-on (0.6 → 2.5s)
    tl.to(earth.rotation, {
      y: kenyaFacing,
      duration: 2.2,
      ease: "power2.inOut",
      delay: 0.6,
    }, 0)

    // Phase 2: camera zoom in — long slow pull (1.0 → 5.0s)
    tl.to(camera.position, {
      x: 0,
      y: 0.08,
      z: 3.3,
      duration: 4.0,
      ease: "power2.inOut",
      onUpdate: () => camera.lookAt(0, 0, 0),
    }, 1.0)

    // Show "locating" tag early
    tl.call(() => setPhase("locating"), [], 1.4)

    // Lock callout when rotation settles
    tl.call(() => setPhase("locked"), [], 2.9)

    // Begin fade
    tl.call(() => setPhase("fading"), [], 4.8)

    // Done
    tl.call(() => onComplete(), [], 5.5)

    // ── Render loop ───────────────────────────────────────
    let raf: number
    let running = true
    const t0 = performance.now()

    const tick = () => {
      if (!running) return
      raf = requestAnimationFrame(tick)
      const t = (performance.now() - t0) / 1000

      // Imperceptibly slow star rotation for depth
      scene.rotation.y = t * 0.003

      // Ring A: fast tight pulse
      const p1 = (t * 1.7) % 1
      ring1.scale.setScalar(1 + p1 * 1.6)
      rMat1.opacity = 0.9 * (1 - p1)

      // Ring B: slower wide pulse, offset
      const p2 = ((t * 1.7 + 0.5) % 1)
      ring2.scale.setScalar(1 + p2 * 2.4)
      rMat2.opacity = 0.45 * (1 - p2)

      // Dot breath
      dot.scale.setScalar(1 + Math.sin(t * 3.8) * 0.22)

      renderer.render(scene, camera)
    }
    tick()

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", onResize)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      tl.kill()
      window.removeEventListener("resize", onResize)
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [onComplete])

  const overlayVisible = phase === "locating" || phase === "locked"
  const overlayFading  = phase === "fading"

  return (
    <div ref={mountRef} className="fixed inset-0" style={{ background: "#020810" }}>

      {/* ── Overlay callout ── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-end pb-20 pointer-events-none"
        style={{
          opacity: overlayFading ? 0 : overlayVisible ? 1 : 0,
          transition: overlayFading ? "opacity 0.7s ease" : "opacity 0.5s ease",
        }}
      >
        {/* Scanning label */}
        <div
          className="flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full"
          style={{
            border: "1px solid rgba(245,166,35,0.3)",
            background: "rgba(245,166,35,0.06)",
            backdropFilter: "blur(8px)",
            opacity: phase === "locating" ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full inline-block"
            style={{ background: "#F5A623", animation: "pulseRing 1.1s ease-out infinite" }}
          />
          <span style={{ fontSize: "0.68rem", color: "rgba(245,166,35,0.8)", fontFamily: "Outfit, sans-serif", letterSpacing: "0.22em", textTransform: "uppercase" }}>
            Locating
          </span>
        </div>

        {/* Location card */}
        <div
          style={{
            background: "rgba(2,8,16,0.82)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(245,166,35,0.25)",
            borderRadius: 24,
            padding: "24px 44px 20px",
            textAlign: "center",
            transform: phase === "locked" ? "translateY(0)" : "translateY(8px)",
            transition: "transform 0.5s ease",
          }}
        >
          {/* Coordinate scan line */}
          <div
            className="font-mono"
            style={{ fontSize: "0.67rem", color: "rgba(245,166,35,0.45)", letterSpacing: "0.18em", marginBottom: 10 }}
          >
            {phase === "locating" ? "── SCANNING ──" : "1.2921° S  ·  36.8219° E"}
          </div>

          {/* Country name */}
          <div
            style={{
              fontFamily: "Fraunces, serif",
              fontSize: "clamp(2.2rem, 6vw, 3.4rem)",
              color: "#ffffff",
              fontWeight: 300,
              letterSpacing: "0.12em",
              lineHeight: 1,
              textShadow: "0 0 40px rgba(245,166,35,0.25)",
            }}
          >
            Kenya
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(245,166,35,0.18)", margin: "16px auto", width: 48 }} />

          {/* Sub-text */}
          <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", fontFamily: "Outfit, sans-serif", letterSpacing: "0.14em", textTransform: "uppercase" }}>
            East Africa
          </div>

          {/* Live badge */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ background: "#4ADE80" }}
            />
            <span style={{ fontSize: "0.65rem", color: "rgba(74,222,128,0.7)", fontFamily: "Outfit, sans-serif", letterSpacing: "0.16em", textTransform: "uppercase" }}>
              Maskani Hub
            </span>
          </div>
        </div>
      </div>

      {/* ── Skip ── */}
      <button
        onClick={onComplete}
        className="absolute top-5 right-6"
        style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.28)", fontFamily: "Outfit, sans-serif", letterSpacing: "0.16em", textTransform: "uppercase" }}
      >
        Skip →
      </button>

      <style>{`
        @keyframes pulseRing {
          0%   { transform: scale(1); opacity: 1; }
          70%  { transform: scale(2.2); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
