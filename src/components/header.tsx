import Link from 'next/link'
import { useAuth, auth } from 'client/firebase'
import Login from './login'
import PropertySelect from './property-select'

export default function Nav() {
  const { user } = useAuth()
  function logOut() {
    auth.signOut()
  }
  return (
    <header className="fixed inset-x-0 top-0 h-14 flex items-center bg-teal-100 px-8">
      <nav className="flex-1 flex text-lg items-center max-w-screen-xl mx-auto">
        {user ? (
          <>
            <Link href="/">
              <a className="mr-8 -ml-2 p-2 font-bold text-purple-800 no-underline">
                Home
              </a>
            </Link>
            <Link href="/units">
              <a className="mr-8 p-2 font-bold text-purple-800 no-underline">
                Units
              </a>
            </Link>
            {/* <Link href="/properties">
              <a className="p-2 font-bold text-purple-800 no-underline">
                Properties
              </a>
            </Link> */}

            <div className="ml-auto flex items-center">
              <PropertySelect />
              <button className="ml-8" onClick={logOut}>
                Log out
              </button>
            </div>
          </>
        ) : (
          <Login className="ml-auto" />
        )}
      </nav>

      <style jsx>{`
        header {
          border-bottom: 2px solid rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </header>
  )
}
