import { useState } from 'react'
import Router from 'next/router'

function setCookie(cname, cvalue, exdays) {
  var d = new Date()
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000)
  var expires = 'expires=' + d.toUTCString()
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
}

function Login() {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!busy) {
      setBusy(true)
      const target = e.target

      const username = target['username'].value
      const password = target['password'].value

      try {
        const result = await fetch('/api/polka/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        }).then((res) => res.json())

        console.log('login result:', result)
        if (!result.error && result.user) {
          setCookie('wpmauth', '1', 6)
          Router.replace('/')
        } else {
          setError(result.error)
        }
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
        <label htmlFor="username" className="flex flex-col py-4">
          <div className="pb-2">Username</div>
          <input
            required
            type="text"
            name="username"
            id="username"
            placeholder="Username"
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

Login.displayName = 'Login'

export default Login
