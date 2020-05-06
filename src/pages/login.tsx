import { useState } from 'react'
import Router from 'next/router'
import { auth } from 'client/firebase'
import { Card, Button, TextField } from 'rmwc/dist'

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
      <Card className="p-8">
        <form onSubmit={handleSubmit}>
          <h1>Sign in</h1>
          <div className="py-4">
            <TextField
              outlined
              required
              label="Email"
              type="email"
              name="email"
              id="email"
              className="w-full"
            />
          </div>
          <div className="py-4">
            <TextField
              outlined
              required
              label="Password"
              type="password"
              name="password"
              id="password"
              className=" w-full"
            />
          </div>
          <div className="py-4 flex justify-end">
            <Button disabled={busy} raised className="text-lg">
              Sign in{' '}
            </Button>
          </div>
          <div>
            <p className="text-lg font-semibold text-red-300">{error}</p>
          </div>
        </form>
      </Card>
    </div>
  )
}
