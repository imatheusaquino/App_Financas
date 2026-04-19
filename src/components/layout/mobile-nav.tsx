'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { LayoutDashboard, ArrowLeftRight, LogOut } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transações', icon: ArrowLeftRight },
]

export function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 flex">
      {navItems.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href} className="flex-1">
          <span
            className={cn(
              'flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors',
              pathname === href ? 'text-blue-600' : 'text-slate-500'
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </span>
        </Link>
      ))}
      <button
        onClick={handleLogout}
        className="flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium text-slate-500"
      >
        <LogOut className="h-5 w-5" />
        Sair
      </button>
    </nav>
  )
}
