import styles from 'styles/header.module.css'
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
    <header
      className={`fixed inset-x-0 top-0 z-20 flex items-center px-8 bg-gray-900 h-15 ${styles.header}`}
    >
      <nav className="flex items-center flex-1 max-w-screen-xl mx-auto text-lg">
        <Link href="/">
          <a className="p-2 mr-8 -ml-2 font-bold text-teal-100 text-teal-400 no-underline">
            Home
          </a>
        </Link>
        <Link href="/properties">
          <a className="p-2 mr-8 -ml-2 font-bold text-teal-100 text-teal-400 no-underline">
            Properties
          </a>
        </Link>
        <Link href="/units">
          <a className="p-2 mr-8 font-bold text-teal-100 text-teal-400 no-underline">
            Units
          </a>
        </Link>
        <Link href="/tenants">
          <a className="p-2 mr-8 font-bold text-teal-100 text-teal-400 no-underline">
            Tenants
          </a>
        </Link>
        <Link href="/info">
          <a className="p-2 mr-8 font-bold text-teal-100 text-teal-400 no-underline">
            Info
          </a>
        </Link>

        <div className="flex items-center ml-auto">
          <PropertySelect />
          <button className="ml-8" onClick={logOut}>
            Log out
          </button>
        </div>
      </nav>
    </header>
  )
}
