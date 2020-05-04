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
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)

const provider = new firebase.auth.GoogleAuthProvider()

let flagNewUser = false
export function signInWithPopup() {
  return auth.signInWithPopup(provider).then((userCred) => {
    if (userCred.additionalUserInfo?.isNewUser) {
      flagNewUser = true
      return new Promise((res, rej) => {
        setTimeout(async () => {
          try {
            await userCred.user?.getIdTokenResult(true)
            res()
          } catch (e) {
            unsub()
            auth.signOut()
          }
        }, 3000)
      })
    }
  })
}

let unsub
const AuthContext = createContext<{
  user?: firebase.User | null
  tokenResult?: firebase.auth.IdTokenResult
}>({})
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<{
    user?: firebase.User | null
    tokenResult?: firebase.auth.IdTokenResult
  }>({})
  useEffect(() => {
    unsub = auth.onIdTokenChanged(async (user) => {
      if (user) {
        if (flagNewUser) {
          console.log('waiting')
          await new Promise((res) => setTimeout(() => res(), 5000))
        }
        try {
          const tokenResult = await user.getIdTokenResult()
          setAuthState({ user, tokenResult })
        } catch (e) {
          unsub()
          setAuthState({ user: null })
        }
      } else {
        setAuthState({ user: null })
      }
    })
    return () => unsub()
  }, [])

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  return { user: {}, tokenResult: { token: '' } } //useContext(AuthContext)
}

export const auth = firebase.auth()
