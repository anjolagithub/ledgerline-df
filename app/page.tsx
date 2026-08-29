'use client'

import { useMemo, useState } from 'react'
import {
  Activity,
  ArrowDownToLine,
  ArrowUpRight,
  Blocks,
  Check,
  ChevronDown,
  CircleDot,
  Copy,
  Cpu,
  Database,
  ExternalLink,
  Fingerprint,
  Gauge,
  KeyRound,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Network,
  RefreshCw,
  Search,
  Server,
  ShieldCheck,
  SlidersHorizontal,
  TerminalSquare,
  WalletCards,
  X,
} from 'lucide-react'

const events = [
  { type: 'payment.succeeded', id: 'evt_8f2a…c19d', time: '12:44:08.291', tone: 'emerald' },
  { type: 'payout.created', id: 'evt_8f2a…c0a7', time: '12:43:51.040', tone: 'blue' },
  { type: 'payment.succeeded', id: 'evt_8f2a…bf88', time: '12:43:18.902', tone: 'emerald' },
  { type: 'invoice.paid', id: 'evt_8f2a…be21', time: '12:42:44.517', tone: 'amber' },
  { type: 'payment.failed', id: 'evt_8f2a…bd0c', time: '12:41:33.105', tone: 'red' },
]

const hashes = [
  ['0x9c4a…71e2', 'Merchant identity', 'verified', '2m ago'],
  ['0x3f82…c019', 'Settlement batch', 'verified', '8m ago'],
  ['0x771d…ae44', 'Policy attestation', 'verified', '14m ago'],
  ['0x0b2e…90fd', 'Node handshake', 'verified', '21m ago'],
  ['0xe6a1…4b77', 'Treasury wallet', 'pending', '32m ago'],
]

function Dot({ tone = 'emerald' }: { tone?: string }) {
  return <span className={`h-1.5 w-1.5 rounded-full ${tone === 'red' ? 'bg-red-400' : tone === 'amber' ? 'bg-amber-400' : tone === 'blue' ? 'bg-sky-400' : 'bg-emerald-400'}`} />
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-xl border border-white/[0.07] bg-[#171717] shadow-[0_16px_50px_rgba(0,0,0,0.16)] ${className}`}>{children}</section>
}

export default function Page() {
  const [range, setRange] = useState('24H')
  const [mobileNav, setMobileNav] = useState(false)
  const [query, setQuery] = useState('')
  const [refreshed, setRefreshed] = useState(false)
  const filteredHashes = useMemo(() => hashes.filter((row) => row.join(' ').toLowerCase().includes(query.toLowerCase())), [query])

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-slate-300 selection:bg-emerald-400/20">
      <header className="flex h-16 items-center justify-between border-b border-white/[0.07] px-5 lg:px-8">
        <div className="flex items-center gap-3">
          <button aria-label="Open navigation" onClick={() => setMobileNav(!mobileNav)} className="rounded-md p-2 text-slate-400 hover:bg-white/[0.06] lg:hidden"><Menu size={18} /></button>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-[#06120e]"><Network size={18} strokeWidth={2.5} /></div>
          <span className="text-sm font-semibold tracking-tight text-slate-100">meridian<span className="text-emerald-400">/</span>admin</span>
          <span className="hidden border-l border-white/10 pl-3 text-xs text-slate-500 sm:block">Operations console</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden items-center gap-2 rounded-md border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-1.5 text-[11px] font-medium text-emerald-400 sm:flex"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" /></span>All systems operational</div>
          <button className="flex items-center gap-2 rounded-md border border-white/10 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-white/[0.06]"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-700 text-[9px] font-bold text-slate-200">AC</span><span className="hidden sm:inline">Acme Corp</span><ChevronDown size={13} /></button>
        </div>
      </header>

      <div className="flex">
        <aside className={`${mobileNav ? 'flex' : 'hidden'} absolute inset-y-16 z-10 w-60 flex-col border-r border-white/[0.07] bg-[#0A0A0A] p-4 lg:static lg:flex lg:min-h-[calc(100vh-4rem)]`}>
          <div className="mb-7 flex items-center justify-between"><span className="px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">Workspace</span><button className="lg:hidden" onClick={() => setMobileNav(false)}><X size={16}/></button></div>
          <nav className="space-y-1 text-xs font-medium">
            {[[LayoutDashboard, 'Overview'], [Activity, 'Activity'], [WalletCards, 'Settlements'], [Fingerprint, 'Identity'], [ShieldCheck, 'Security']].map(([Icon, label], i) => <button key={label as string} className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left ${i === 0 ? 'bg-white/[0.08] text-slate-100' : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-300'}`}><Icon size={15} className={i === 0 ? 'text-emerald-400' : ''}/>{label as string}{i === 1 && <span className="ml-auto rounded bg-white/10 px-1.5 py-0.5 text-[9px] text-slate-400">12</span>}</button>)}
          </nav>
          <div className="mt-auto space-y-1 border-t border-white/[0.07] pt-4"><button className="flex w-full items-center gap-3 px-3 py-2 text-xs text-slate-600 hover:text-slate-300"><SlidersHorizontal size={15}/> Configuration</button><button className="flex w-full items-center gap-3 px-3 py-2 text-xs text-slate-600 hover:text-slate-300"><TerminalSquare size={15}/> API reference <ExternalLink size={11} className="ml-auto"/></button></div>
        </aside>

        <div className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-slate-600"><span>Workspace /</span><span className="text-slate-400">Overview</span></div><h1 className="text-2xl font-semibold tracking-tight text-slate-100">Infrastructure overview</h1><p className="mt-1 text-xs text-slate-500">System health and settlement activity across your network.</p></div><div className="flex items-center gap-2"><div className="flex rounded-md border border-white/[0.08] p-0.5">{['1H', '24H', '7D'].map((item) => <button key={item} onClick={() => setRange(item)} className={`px-2.5 py-1.5 text-[10px] font-semibold ${range === item ? 'rounded bg-white/10 text-slate-200' : 'text-slate-600 hover:text-slate-400'}`}>{item}</button>)}</div><button onClick={() => { setRefreshed(true); setTimeout(() => setRefreshed(false), 1200) }} className="rounded-md border border-white/[0.08] p-2 text-slate-500 hover:bg-white/[0.05] hover:text-slate-200" aria-label="Refresh dashboard"><RefreshCw size={14} className={refreshed ? 'animate-spin text-emerald-400' : ''}/></button></div></div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
              <Card className="xl:col-span-7"><div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4"><div className="flex items-center gap-2"><Gauge size={15} className="text-emerald-400"/><h2 className="text-xs font-semibold text-slate-200">Infrastructure overview</h2></div><span className="text-[10px] text-slate-600">Last {range}</span></div><div className="grid grid-cols-3 divide-x divide-white/[0.06] px-5 py-5"><div><p className="mb-3 text-[10px] uppercase tracking-wider text-slate-600">Active nodes</p><p className="text-2xl font-semibold tracking-tight text-slate-100">18<span className="ml-1 text-sm font-normal text-slate-600">/ 18</span></p><div className="mt-3 flex items-center gap-1.5 text-[10px] text-emerald-400"><Dot/>100% uptime</div></div><div className="pl-4 sm:pl-6"><p className="mb-3 text-[10px] uppercase tracking-wider text-slate-600">Throughput</p><p className="text-2xl font-semibold tracking-tight text-slate-100">$2.84<span className="ml-1 text-sm font-normal text-slate-500">M</span></p><div className="mt-3 flex items-center gap-1.5 text-[10px] text-emerald-400"><ArrowUpRight size={12}/>+12.8%</div></div><div className="pl-4 sm:pl-6"><p className="mb-3 text-[10px] uppercase tracking-wider text-slate-600">Network gas</p><p className="text-2xl font-semibold tracking-tight text-slate-100">0.004<span className="ml-1 text-sm font-normal text-slate-500">ETH</span></p><div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-500"><ArrowDownToLine size={12}/>−4.2%</div></div></div><div className="border-t border-white/[0.06] px-5 py-4"><div className="flex items-end gap-1.5" aria-label="Throughput activity chart">{[22, 35, 29, 44, 38, 54, 48, 66, 58, 72, 60, 78, 72, 89, 81, 95, 83, 90, 77, 94, 88, 97, 92, 99].map((height, i) => <div key={i} className="h-16 flex-1 rounded-sm bg-emerald-400/[0.12]" style={{ height: `${height * 0.58}px` }}><div className="h-full w-full rounded-sm bg-emerald-400/50" /></div>)}</div><div className="mt-2 flex justify-between text-[9px] text-slate-700"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>Now</span></div></div></Card>

              <Card className="xl:col-span-5"><div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4"><div className="flex items-center gap-2"><Server size={15} className="text-sky-400"/><div><h2 className="text-xs font-semibold text-slate-200">Verification Monitor</h2><p className="mt-1 text-[10px] text-slate-500">Real-time stream of decoded Sepolia transaction receipts, block timestamps, and Attestcoin proof status.</p></div></div><span className="flex items-center gap-1.5 text-[10px] text-emerald-400"><Dot/>Live</span></div><div className="divide-y divide-white/[0.05] px-5">{events.map((event) => <div key={event.id} className="flex items-center gap-3 py-3"><Dot tone={event.tone}/><div className="min-w-0 flex-1"><p className="truncate font-mono text-[10px] text-slate-300">{event.type}</p><p className="mt-0.5 font-mono text-[9px] text-slate-600">{event.id}</p></div><time className="font-mono text-[9px] text-slate-600">{event.time}</time></div>)}</div><div className="border-t border-white/[0.06] px-5 py-3"><button className="text-[10px] font-medium text-slate-500 hover:text-emerald-400">View all verification logs <ArrowUpRight className="ml-1 inline" size={11}/></button></div></Card>

              <Card className="xl:col-span-7"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-4"><div className="flex items-center gap-2"><Fingerprint size={15} className="text-violet-400"/><h2 className="text-xs font-semibold text-slate-200">Identity trust log</h2><span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[9px] text-slate-500">5,284</span></div><div className="flex items-center gap-2 rounded-md border border-white/[0.08] px-2 py-1.5"><Search size={12} className="text-slate-600"/><input value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Filter identity hashes" placeholder="Filter hashes" className="w-24 bg-transparent text-[10px] text-slate-300 outline-none placeholder:text-slate-700"/></div></div><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-white/[0.05] text-[9px] uppercase tracking-wider text-slate-700"><th className="px-5 py-3 font-medium">Hash</th><th className="px-3 py-3 font-medium">Record type</th><th className="px-3 py-3 font-medium">State</th><th className="px-5 py-3 text-right font-medium">Created</th></tr></thead><tbody className="divide-y divide-white/[0.04]">{filteredHashes.map(([hash, type, state, time]) => <tr key={hash} className="text-[10px] hover:bg-white/[0.025]"><td className="px-5 py-3 font-mono text-slate-400">{hash} <button aria-label={`Copy ${hash}`} className="ml-1 text-slate-700 hover:text-slate-300"><Copy size={11} className="inline"/></button></td><td className="px-3 py-3 text-slate-500">{type}</td><td className="px-3 py-3"><span className={`inline-flex items-center gap-1.5 ${state === 'pending' ? 'text-amber-400' : 'text-emerald-400'}`}><Dot tone={state === 'pending' ? 'amber' : 'emerald'}/>{state}</span></td><td className="px-5 py-3 text-right text-slate-600">{time}</td></tr>)}</tbody></table></div></Card>

              <Card className="xl:col-span-5"><div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4"><div className="flex items-center gap-2"><ShieldCheck size={15} className="text-emerald-400"/><h2 className="text-xs font-semibold text-slate-200">Security engine status</h2></div><MoreHorizontal size={16} className="text-slate-600"/></div><div className="p-5"><div className="mb-6 flex items-start justify-between"><div><p className="mb-2 text-[10px] uppercase tracking-wider text-slate-600">Connection bridge</p><p className="font-mono text-sm text-slate-200">Creditcoin Precompile</p><p className="mt-1 font-mono text-[10px] text-slate-500">0x0FD2<span className="ml-2 text-slate-700">·</span><span className="ml-2">Mainnet</span></p></div><div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-400"><KeyRound size={17}/></div></div><div className="flex items-center gap-3 rounded-lg border border-emerald-400/20 bg-emerald-400/[0.06] p-3"><div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400 text-[#07120e]"><Check size={15} strokeWidth={3}/></div><div><p className="text-[11px] font-bold text-emerald-400">24/24 Foundry Unit Tests Passing</p><p className="mt-0.5 text-[9px] text-emerald-400/60">Permanent connection established</p></div></div><div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/[0.06] pt-4"><div><p className="text-[9px] uppercase tracking-wider text-slate-700">Last audit</p><p className="mt-1 text-[10px] text-slate-400">Aug 29, 12:38 UTC</p></div><div><p className="text-[9px] uppercase tracking-wider text-slate-700">Engine version</p><p className="mt-1 font-mono text-[10px] text-slate-400">v2.4.1-stable</p></div></div></div></Card>
            </div>
            <footer className="mt-6 flex flex-col gap-2 border-t border-white/[0.06] pt-4 text-[10px] text-slate-700 sm:flex-row sm:items-center sm:justify-between"><span className="flex items-center gap-2"><Cpu size={12}/> Meridian infrastructure · Region us-east-1</span><span className="flex items-center gap-3"><span>API latency <b className="font-medium text-emerald-500">42ms</b></span><span className="h-1 w-1 rounded-full bg-slate-700"/><span>v2.8.0</span></span></footer>
          </div>
        </div>
      </div>
    </main>
  )
}
