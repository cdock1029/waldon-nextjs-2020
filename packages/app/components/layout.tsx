import Nav from './nav'
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen overflow-y-auto p-8">
      <Nav />
      {children}
    </div>
  )
}
