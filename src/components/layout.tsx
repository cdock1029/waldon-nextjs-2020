import { useAuth } from 'data/firebase'
import Header from './header'
import Login from './login'
import Loading from './loading'

export default function Layout({ children }: { children: React.ReactNode }) {
  const authState = useAuth()
  return (
    <div className="h-screen max-h-full flex flex-col overflow-y-auto p-4">
      <Header />
      <main className="flex-1 relative">
        {typeof authState.user === 'undefined' ? (
          <Loading />
        ) : authState.user ? (
          children
        ) : (
          <Login />
        )}
      </main>
    </div>
  )
}
