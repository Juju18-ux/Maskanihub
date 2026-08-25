const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyBrXLWLQhUeoojgVVtNWWYU1UMK8KbOtAg",
  authDomain:        "maskani-hub.firebaseapp.com",
  projectId:         "maskani-hub",
  storageBucket:     "maskani-hub.firebasestorage.app",
  messagingSenderId: "765506849343",
  appId:             "1:765506849343:web:69110024daa13a5b96068a",
}

export const isConfigured = () => true

export type MappedUser = { name: string; email: string; avatar?: string }

function mapUser(u: { displayName: string | null; email: string | null; photoURL: string | null }): MappedUser {
  return {
    name:   u.displayName || u.email?.split("@")[0] || "User",
    email:  u.email || "",
    avatar: u.photoURL || undefined,
  }
}

async function getAuth() {
  const { initializeApp, getApps } = await import("firebase/app")
  const { getAuth: _getAuth } = await import("firebase/auth")
  const app = getApps().length ? getApps()[0] : initializeApp(FIREBASE_CONFIG)
  return _getAuth(app)
}

// Use redirect instead of popup — works in iframes and popup-blocked environments.
// Call checkRedirectResult() on app mount to capture the returned user.
export async function signInGoogleRedirect(): Promise<void> {
  const auth = await getAuth()
  const { GoogleAuthProvider, signInWithRedirect } = await import("firebase/auth")
  const p = new GoogleAuthProvider()
  p.addScope("email")
  p.addScope("profile")
  await signInWithRedirect(auth, p)
}

export async function checkRedirectResult(): Promise<MappedUser | null> {
  const auth = await getAuth()
  const { getRedirectResult } = await import("firebase/auth")
  const result = await getRedirectResult(auth)
  return result ? mapUser(result.user) : null
}

export async function signInEmail(email: string, password: string): Promise<MappedUser> {
  const auth = await getAuth()
  const { signInWithEmailAndPassword } = await import("firebase/auth")
  const r = await signInWithEmailAndPassword(auth, email, password)
  return mapUser(r.user)
}

export async function signUpEmail(email: string, password: string, name: string): Promise<MappedUser> {
  const auth = await getAuth()
  const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth")
  const r = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(r.user, { displayName: name })
  return mapUser({ ...r.user, displayName: name })
}

export async function signOutUser(): Promise<void> {
  const auth = await getAuth()
  const { signOut } = await import("firebase/auth")
  await signOut(auth)
}
