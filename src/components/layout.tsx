import Header from './header'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout h-screen max-h-full flex flex-col px-8 pt-15">
      <Header />
      <main className="flex-1 relative max-w-screen-xl w-full mx-auto">
        {children}
      </main>
      <style jsx>{`
        .layout {
          overflow-y: overlay;
          overflow-x: hidden;
        }
      `}</style>
      <footer className="py-16">
        <div className="max-w-screen-xl w-full mx-auto">
          <img src="/business.svg" alt="building" height="32" width="32" />
        </div>
      </footer>
    </div>
  )
}
