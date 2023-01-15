import { Header } from './Header'

interface Layout {
   children: React.ReactNode
}

export const PageLayout: React.FC<Layout> = ({ children }) => {
   return (
      <div className="flex min-h-screen flex-col items-center bg-slate-700 text-slate-100">
          <Header />
        <main className="container flex w-full flex-col justify-center gap-12 px-4 py-16 text-2xl">

      {children}
        </main>
        </div>
   )
}