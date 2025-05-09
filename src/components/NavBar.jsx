import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function NavBar() {
  const { pathname } = useLocation()
  const links = [
    { to: '/',       label: 'Home'    },
    { to: '/music',  label: 'Music'   },
    { to: '/journal',label: 'Journal' },
    { to: '/about',  label: 'About'   },
    { to: '/contact',label: 'Contact' }
  ]
  return (
    <nav className="fixed top-0 w-full bg-deepBlack/80 backdrop-blur p-2 flex justify-center space-x-6 z-20">
      {links.map(link => (
        <Link
          key={link.to}
          to={link.to}
          className={`text-sm hover:text-neon transition ${
            pathname === link.to ? 'text-neon' : ''
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}