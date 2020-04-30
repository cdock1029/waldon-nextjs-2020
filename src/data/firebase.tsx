import { useState, useEffect, createContext, useContext } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyDgsL-7pZ93FermLxRUjIo4PzwqUvQ8zuc',
  authDomain: 'waldon-aea37.firebaseapp.com',
  databaseURL: 'https://waldon-aea37.firebaseio.com',
  projectId: 'waldon-aea37',
  storageBucket: 'waldon-aea37.appspot.com',
  messagingSenderId: '955308934457',
  appId: '1:955308934457:web:ab3ae2f3b307ff3a7894e8',
  measurementId: 'G-Q8898Y9SYL',
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

const provider = new firebase.auth.GoogleAuthProvider()

export function signInWithPopup() {
  return auth.signInWithPopup(provider)
}

const AuthContext = createContext<{
  user?: firebase.User
  tokenResult?: firebase.auth.IdTokenResult
}>({})
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<{
    user?: firebase.User
    tokenResult?: firebase.auth.IdTokenResult
  }>({})
  useEffect(() => {
    auth.onIdTokenChanged(async (user) => {
      if (user) {
        const tokenResult = await user.getIdTokenResult()
        setAuthState({ user, tokenResult })
      } else {
        setAuthState({})
      }
    })
  }, [])

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export const auth = firebase.auth()
