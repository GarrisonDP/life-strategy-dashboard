import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Life Strategy Dashboard',
  description: 'Personal life strategy dashboard with timeline, swimlanes, and financial projections',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full dark">
      <body className="h-full flex flex-col bg-slate-900 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  )
}
