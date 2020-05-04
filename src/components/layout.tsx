import { useAuth } from 'client/firebase'
import Header from './header'
import Loading from './loading'

export default function Layout({ children }: { children: React.ReactNode }) {
  const authState = useAuth()
  return (
    <div className="h-screen max-h-full flex flex-col overflow-y-auto px-8 pt-20">
      <Header />
      <main className="flex-1 relative max-w-screen-xl w-full mx-auto">
        {typeof authState.user === 'undefined' ? (
          <Loading />
        ) : authState.user ? (
          children
        ) : null}
      </main>
    </div>
  )
}
