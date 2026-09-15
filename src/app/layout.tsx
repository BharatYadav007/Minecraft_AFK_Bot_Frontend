import './globals.css'

export const metadata = { title:'Mineflayer Control', description:'Multi-bot Minecraft dashboard' }

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body><header className="topbar"><a href="/" className="brand">Mineflayer Control</a><span className="muted">Multi-bot</span></header>{children}</body></html>
}
