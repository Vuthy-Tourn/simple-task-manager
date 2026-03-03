import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TaskManager',
  description: 'Fullstack Task Management — Next.js + Spring Boot + PostgreSQL',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Syne', sans-serif", background: '#0a0e1a', color: '#dce6f5', minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  )
}
