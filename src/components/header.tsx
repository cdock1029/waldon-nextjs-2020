import Link from 'next/link'
import Router from 'next/router'
import PropertySelect from './property-select'

export default function Nav() {
  async function logOut() {
    try {
      await fetch('/api/polka/auth/logout', { method: 'POST' })
      document.cookie = 'wpmauth=; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
    } catch (e) {
      console.log('Error', e)
    } finally {
      Router.replace('/login')
    }
  }

  return (
    <header className="fixed z-20 inset-x-0 top-0 h-15 flex items-center bg-gray-900 px-8">
      <nav className="flex-1 flex text-lg items-center max-w-screen-xl mx-auto">
        <Link href="/">
          <a className="mr-8 -ml-2 p-2 text-teal-400 font-bold text-teal-100 no-underline">
            Home
          </a>
        </Link>
        <Link href="/properties">
          <a className="mr-8 -ml-2 p-2 text-teal-400 font-bold text-teal-100 no-underline">
            Properties
          </a>
        </Link>
        <Link href="/units">
          <a className="mr-8 p-2 text-teal-400 font-bold text-teal-100 no-underline">
            Units
          </a>
        </Link>
        <Link href="/tenants">
          <a className="mr-8 p-2 text-teal-400 font-bold text-teal-100 no-underline">
            Tenants
          </a>
        </Link>

        <div className="ml-auto flex items-center">
          <PropertySelect />
          <button className="ml-8" onClick={logOut}>
            Log out
          </button>
        </div>
      </nav>

      <style jsx>{`
        header {
          border-bottom: 2px solid rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </header>
  )
}
