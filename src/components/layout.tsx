import Header from './header'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen max-h-full flex flex-col overflow-y-auto px-8 pt-15">
      <Header />
      <main className="flex-1 relative max-w-screen-xl w-full mx-auto">
        {children}
      </main>
    </div>
  )
}
