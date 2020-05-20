import styles from 'styles/layout.module.css'
import Link from 'next/link'
import Router from 'next/router'
import PropertySelect from './property-select'

export function Layout({
  children,
  properties,
}: {
  children: React.ReactNode
  properties: Property[]
}) {
  async function logOut() {
    try {
      await fetch('/api/polka/auth/logout', { method: 'POST' })
    } catch (e) {
      console.log('Error', e)
    } finally {
      document.cookie = 'wpmauth=; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
      Router.replace('/login')
    }
  }
  return (
    <div
      className={`flex flex-col h-screen max-h-full px-8 ${styles.layout} py-15`}
    >
      <header className="fixed inset-x-0 top-0 z-20 flex items-center px-8 bg-gray-900 h-15">
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

          <div className="flex items-center ml-auto">
            <PropertySelect properties={properties} />
            <button className="ml-8" onClick={logOut}>
              Log out
            </button>
          </div>
        </nav>
      </header>

      <main className="relative flex-1 w-full max-w-screen-xl mx-auto">
        {children}
      </main>
    </div>
  )
}
