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

export const auth = firebase.auth()
