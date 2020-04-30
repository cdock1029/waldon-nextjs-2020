import Link from 'next/link'
import { useAuth, auth } from 'data/firebase'

export default function Nav() {
  const { user } = useAuth()
  function logOut() {
    auth.signOut()
  }
  return (
    <header className="flex items-center bg-teal-200 px-8 py-2">
      <nav className="flex-1 flex items-center text-lg">
        <Link href="/">
          <a className="mr-8 text-purple-600 p-2 font-semibold underline">
            Home
          </a>
        </Link>
        <Link href="/properties">
          <a className="underline font-semibold p-2 text-purple-600">
            Properties
          </a>
        </Link>
      </nav>
      {user && <button onClick={logOut}>Log out</button>}
    </header>
  )
}
