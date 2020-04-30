import Nav from './nav'
import Login from 'components/login'
import { useAuth } from 'data/firebase'

export default function Layout({ children }: { children: React.ReactNode }) {
  const authState = useAuth()
  return (
    <div className="h-screen overflow-y-auto p-8">
      <Nav />
      {authState.user ? children : <Login />}
    </div>
  )
}
