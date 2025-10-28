'use client'

import Link from 'next/link';

interface MobileNavProps {
    links: { href: string; label: string }[];
}

export function MobileNav({ links }: MobileNavProps) {
  return (
    <nav className="grid grid-flow-row auto-rows-max text-sm">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="flex w-full items-center rounded-md p-2 text-base font-medium hover:underline"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
