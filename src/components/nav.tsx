import Link from 'next/link'
import { useAuth, auth } from 'data/firebase'

const links = [
  { href: '/', label: 'Home' },
  { href: '/properties', label: 'Properties' },
]

export default function Nav() {
  const { user } = useAuth()

  function logOut() {
    auth.signOut()
  }
  return (
    <nav>
      <ul className="flex justify-between items-center p-8">
        <li>
          <Link href="/">
            <a className="text-purple-500 font-semibold no-underline">Home</a>
          </Link>
        </li>
        <ul className="flex justify-between items-center">
          {links.map(({ href, label }) => (
            <li key={`${href}${label}`} className="ml-4">
              <Link href={href}>
                <a className="btn-blue no-underline">{label}</a>
              </Link>
            </li>
          ))}
          {user && <button onClick={logOut}>Log out</button>}
        </ul>
      </ul>
    </nav>
  )
}
