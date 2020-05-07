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
        }
      `}</style>
      <footer className="py-16">
        <div className="max-w-screen-xl w-full mx-auto">
          <div>This is some text in footer</div>
        </div>
      </footer>
    </div>
  )
}
