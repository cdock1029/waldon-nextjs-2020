import Link from 'next/link'
import { useAuth, auth } from 'data/firebase'

export default function Nav() {
  const { user } = useAuth()
  function logOut() {
    auth.signOut()
  }
  return (
    <header className="fixed inset-x-0 top-0 h-16 flex items-center bg-teal-100 px-8">
      <nav className="flex-1 flex items-center text-lg">
        <Link href="/">
          <a className="mr-8 p-2 font-semibold">Home</a>
        </Link>
        <Link href="/properties">
          <a className="font-semibold p-2">Properties</a>
        </Link>
      </nav>
      {user && <button onClick={logOut}>Log out</button>}
    </header>
  )
}
