import styles from 'styles/layout.module.css'
import Header from './header'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`flex flex-col h-screen max-h-full px-8 ${styles.layout} pt-15`}
    >
      <Header />
      <main className="relative flex-1 w-full max-w-screen-xl mx-auto">
        {children}
      </main>
      <footer className="py-16">
        <div className="w-full max-w-screen-xl mx-auto">
          <img src="/business.svg" alt="building" height="32" width="32" />
        </div>
      </footer>
    </div>
  )
}
