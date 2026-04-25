'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, BookOpen } from 'lucide-react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/articles', label: 'Articles' },
  { href: '/issues', label: 'Issues' },
  { href: '/editorial-board', label: 'Editorial Board' },
  { href: '/submit', label: 'Submit' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <nav className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <BookOpen className="w-7 h-7 text-blue-300" />
          <span>Global Medical Journal</span>
        </Link>
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
        <ul className="hidden md:flex items-center gap-6 text-sm font-medium">
          {links.map(l => (
            <li key={l.href}>
              <Link href={l.href} className="hover:text-blue-300 transition-colors">{l.label}</Link>
            </li>
          ))}
          <li>
            <Link href="/admin" className="bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-md transition-colors">Admin</Link>
          </li>
        </ul>
      </div>
      {open && (
        <div className="md:hidden bg-blue-800 px-4 pb-4">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="block py-2 hover:text-blue-300" onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
          <Link href="/admin" className="block py-2 text-blue-300 font-semibold" onClick={() => setOpen(false)}>Admin</Link>
        </div>
      )}
    </nav>
  )
}
