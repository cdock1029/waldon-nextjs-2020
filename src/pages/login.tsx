import { useState } from 'react'
import Router from 'next/router'
import { auth } from 'client/firebase'

function setCookie(cname, cvalue, exdays) {
  var d = new Date()
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000)
  var expires = 'expires=' + d.toUTCString()
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
}

export default function Login() {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!busy) {
      setBusy(true)
      const target = e.target

      const email = target['email'].value
      const password = target['password'].value

      try {
        const cred = await auth.signInWithEmailAndPassword(email, password)
        const token = await cred.user?.getIdToken()

        await fetch('/api/polka/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })
        setCookie('wpmauth', '1', 6)
        Router.replace('/')
      } catch (e) {
        setError(e.message)
      } finally {
        setBusy(false)
      }
    }
  }
  return (
    <div className="max-w-md w-full mx-auto pt-8">
      <form
        onSubmit={handleSubmit}
        className="rounded shadow-md bg-gray-700 p-8"
      >
        <h1>Sign in</h1>
        <label htmlFor="email" className="flex flex-col py-4">
          <div className="pb-2">Email</div>
          <input
            required
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            className="text-lg p-1"
          />
        </label>
        <label htmlFor="password" className="flex flex-col py-4">
          <div className="pb-2">Password</div>
          <input
            required
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            className="text-lg p-1"
          />
        </label>
        <div className="py-4 flex justify-end">
          <button disabled={busy} className="text-lg">
            Sign in{' '}
          </button>
        </div>
        <div>
          <p className="text-lg font-semibold text-red-300">{error}</p>
        </div>
      </form>
    </div>
  )
}
