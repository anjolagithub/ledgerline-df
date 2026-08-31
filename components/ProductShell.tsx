'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Activity, BadgeCheck, BookOpen, FileText, LayoutDashboard, Landmark, Menu, ShieldCheck, X } from 'lucide-react'
import { useState } from 'react'

const nav = [
  ['Overview', '/', LayoutDashboard],
  ['Credit Profile', '/credit-profile', BadgeCheck],
  ['Invoices', '/invoices', FileText],
  ['Financing', '/financing', Landmark],
  ['Verification', '/verification', ShieldCheck],
  ['Developers', '/developers', BookOpen],
] as const

export function ProductShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  return <div className="min-h-screen bg-background text-foreground">
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-xl"><div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 lg:px-8"><Link href="/" className="flex items-center gap-3 text-xs font-semibold tracking-[.24em] text-slate-100"><span className="grid h-7 w-7 place-items-center bg-primary text-primary-foreground"><Activity size={14}/></span>LEDGERLINE</Link><button className="p-2 text-slate-400 lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X size={18}/> : <Menu size={18}/>}</button><nav aria-label="Primary navigation" className="hidden items-center gap-6 lg:flex">{nav.map(([label, href, Icon]) => <Link key={href} href={href} className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.1em] ${pathname === href ? 'text-primary' : 'text-slate-500 hover:text-slate-200'}`}><Icon size={13}/>{label}</Link>)}</nav></div>{open && <nav aria-label="Mobile navigation" className="border-t border-border px-5 py-3 lg:hidden">{nav.map(([label, href, Icon]) => <Link key={href} href={href} onClick={() => setOpen(false)} className={`flex items-center gap-3 border-b border-border py-4 font-mono text-[10px] uppercase tracking-[.1em] ${pathname === href ? 'text-primary' : 'text-slate-400'}`}><Icon size={14}/>{label}</Link>)}</nav>}</header><main className="mx-auto max-w-[1440px]">{children}</main><footer className="mx-auto flex max-w-[1440px] items-center justify-between border-t border-border px-5 py-8 font-mono text-[10px] uppercase tracking-[.12em] text-slate-600 lg:px-8"><span>Built with Attestcoin · Creditcoin</span><span>© 2026 LedgerLine</span></footer>
  </div>
}

export function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) { return <div className="border-b border-border px-5 py-10 lg:px-10"><p className="eyebrow text-primary">{eyebrow}</p><h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-.04em] text-slate-100 md:text-5xl">{title}</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500">{description}</p></div> }
