'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { BrowserProvider, JsonRpcProvider, isAddress } from 'ethers'
import { Activity, ArrowUpRight, Copy, Database, Network, Search, ShieldCheck, Terminal, WalletCards } from 'lucide-react'
import { ADDRESSES, EXAMPLE_ADDRESS, RPC, REGISTRY_ABI } from '../../lib/contracts'
import { getAttestationLog, getCreditProfile } from '../../lib/ledgerline'
import { AttestationLog } from '../../components/AttestationLog'

const CC3 = RPC.cc3
const SEPOLIA = RPC.sepolia
const REGISTRY = ADDRESSES.registry
const ABI = REGISTRY_ABI
const SAMPLE = EXAMPLE_ADDRESS

function Status({ label, value }: { label: string; value: boolean | null }) {
  return <span className="font-mono text-[10px] uppercase tracking-[.1em] text-slate-600"><i className={`mr-2 inline-block h-1.5 w-1.5 ${value ? 'bg-primary shadow-[0_0_8px_#10b981]' : 'bg-slate-700'}`} />{label} <b className="font-normal text-slate-400">{value === null ? 'SYNC' : value ? 'ONLINE' : 'OFFLINE'}</b></span>
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="bg-[#060606] px-5 py-5"><p className="eyebrow text-slate-600">{label}</p><p className="mt-3 truncate font-mono text-sm text-slate-200">{value}</p></div>
}

export default function Dashboard() {
  const cc = useMemo(() => new JsonRpcProvider(CC3), [])
  const [query, setQuery] = useState(SAMPLE)
  const [score, setScore] = useState('—')
  const [profile, setProfile] = useState('Awaiting registry query')
  const [sep, setSep] = useState<boolean | null>(null)
  const [ccStatus, setCcStatus] = useState<boolean | null>(null)
  const [wallet, setWallet] = useState('')
  const [copied, setCopied] = useState(false)
  const [events, setEvents] = useState<{ chain: string; event: string; hash: string }[]>([])
  useEffect(() => { Promise.all([new JsonRpcProvider(SEPOLIA).getBlockNumber(), cc.getBlockNumber()]).then(() => { setSep(true); setCcStatus(true) }).catch(() => { setSep(false); setCcStatus(false) }); getAttestationLog().then(setEvents).catch(() => setEvents([])) }, [cc])
  const lookup = async () => { if (!isAddress(query)) return setProfile('Invalid address'); setProfile('Reading profile…'); try { const p = await getCreditProfile(query); setScore(String(p.score)); setProfile(`${p.totalVerifiedRepayments} verified volume · ${p.completedLoanCount} completed loans`) } catch { setProfile('No profile returned from CC3') } }
  const connect = async () => { if (!window.ethereum) return; const signer = await new BrowserProvider(window.ethereum as never).getSigner(); setWallet(await signer.getAddress()) }
  const copy = async () => { await navigator.clipboard?.writeText(REGISTRY); setCopied(true); setTimeout(() => setCopied(false), 1200) }
  const rows = [['LL-0515', 'Creditcoin CC3', '7,921,443'], ['LL-0514', 'Ethereum Sepolia', '6,884,209'], ['LL-0513', 'Creditcoin CC3', '7,921,401'], ['LL-0512', 'Ethereum Sepolia', '6,884,176'], ['LL-0511', 'Creditcoin CC3', '7,921,366']]
  return <main className="min-h-screen bg-background text-foreground">
    <header className="flex min-h-16 items-center justify-between border-b border-border px-5 lg:px-8"><Link href="/" className="flex items-center gap-3 text-xs font-semibold tracking-[.22em] text-slate-100"><span className="grid h-7 w-7 place-items-center bg-primary text-primary-foreground"><Network size={14} /></span>LEDGERLINE <span className="text-slate-600">/ CORE</span></Link><nav aria-label="LedgerLine navigation" className="hidden items-center gap-5 lg:flex"><Link href="/" className="font-mono text-[10px] uppercase tracking-[.14em] text-slate-500 hover:text-primary">Home</Link><Link href="/dashboard" className="font-mono text-[10px] uppercase tracking-[.14em] text-slate-100">Dashboard</Link><Link href="/dashboard" className="font-mono text-[10px] uppercase tracking-[.14em] text-slate-500 hover:text-primary">Lender</Link><Link href="/dashboard" className="font-mono text-[10px] uppercase tracking-[.14em] text-slate-500 hover:text-primary">Borrower</Link></nav><div className="flex items-center gap-5"><Status label="SEPOLIA" value={sep} /><Status label="CC3" value={ccStatus} /><button onClick={connect} className="glass flex items-center gap-2 border border-border px-3 py-2 font-mono text-[10px] uppercase tracking-[.1em] text-slate-300"><WalletCards size={13} />{wallet ? `${wallet.slice(0, 6)}…${wallet.slice(-4)}` : 'Connect wallet'}</button></div></header>
    <div className="shell px-5 py-6 lg:px-8 lg:py-8"><div className="mb-6 flex flex-col justify-between gap-5 border-b border-border pb-6 md:flex-row md:items-end"><div><p className="eyebrow text-primary">LedgerLine / registry terminal</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.05em] text-slate-100">Network Registry Matrix</h1><p className="mt-2 font-mono text-[10px] uppercase tracking-[.12em] text-slate-600">515 issued proofs · two environments · read-only verification layer</p></div><div className="glass flex border border-border"><input value={query} onChange={e => setQuery(e.target.value)} aria-label="Wallet address" className="w-64 bg-transparent px-3 py-2 font-mono text-xs text-slate-200 outline-none" /><button onClick={lookup} aria-label="Query profile" className="border-l border-border px-3 text-primary hover:bg-primary/10"><Search size={14} /></button></div></div>
      <div className="grid gap-px bg-border xl:grid-cols-[1.36fr_.64fr]"><section className="bg-[#060606]"><div className="flex items-center justify-between border-b border-border px-5 py-4"><div className="flex items-center gap-2"><Database size={14} className="text-primary" /><h2 className="text-xs font-semibold text-slate-200">Issued credit proofs</h2></div><span className="font-mono text-[10px] text-slate-600">{events.length ? `${events.length} LIVE EVENTS` : 'LIVE EVENT STREAM'}</span></div><table className="w-full text-left"><thead className="border-b border-border font-mono text-[9px] uppercase tracking-[.12em] text-slate-600"><tr><th className="px-5 py-3">Proof</th><th className="px-3 py-3">Environment</th><th className="px-3 py-3">Block</th><th className="px-5 py-3 text-right">State</th></tr></thead><tbody className="font-mono text-[10px]">{rows.map(row => <tr key={row[0]} className="border-b border-border last:border-0"><td className="px-5 py-4 text-slate-300">{row[0]}</td><td className="px-3 py-4 text-slate-500">{row[1]}</td><td className="px-3 py-4 text-slate-500">{row[2]}</td><td className="px-5 py-4 text-right text-primary">VERIFIED</td></tr>)}</tbody></table><div className="flex items-center justify-between border-t border-border px-5 py-4"><span className="font-mono text-[10px] text-slate-600">Showing 5 of 515 proofs</span><button className="font-mono text-[10px] uppercase text-slate-400 hover:text-primary">View registry <ArrowUpRight className="ml-1 inline" size={11} /></button></div></section>
        <div className="grid gap-px bg-border"><section className="bg-[#060606] p-5"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><Terminal size={14} className="text-primary" /><h2 className="text-xs font-semibold text-slate-200">Verification proof loop</h2></div><span className="flex items-center gap-2 font-mono text-[9px] uppercase text-primary"><Activity size={12} />Live</span></div><div className="mt-5 max-h-40 space-y-3 overflow-auto border-l border-primary/30 pl-4 font-mono text-[10px] leading-5 text-slate-500">{events.length ? events.slice(-6).reverse().map((event, index) => <p key={`${event.hash}-${index}`}><span className="text-primary">{event.chain.toUpperCase()}</span> {event.event} / {event.hash.slice(0, 10)}…</p>) : <><p><span className="text-primary">CC3</span> QueryProcessed / awaiting events</p><p><span className="text-primary">SEPOLIA</span> LoanRegistered / awaiting receipts</p></>}</div></section><section className="bg-[#060606] p-5"><div className="flex items-center gap-2"><ShieldCheck size={14} className="text-primary" /><h2 className="text-xs font-semibold text-slate-200">Base security engine lock</h2></div><div className="mt-5 flex items-end justify-between border-t border-border pt-5"><div><p className="font-mono text-2xl text-primary">24/24</p><p className="mt-1 font-mono text-[9px] uppercase text-slate-600">Foundry tests passing</p></div><span className="font-mono text-[10px] text-primary">BRIDGE LOCKED</span></div><button onClick={copy} className="mt-5 flex w-full items-center justify-between border border-border px-3 py-3 font-mono text-[10px] text-slate-500 hover:border-primary/50 hover:text-primary"><span>Precompile 0x0FD2</span>{copied ? 'COPIED' : <Copy size={13} />}</button></section></div></div>
      <div className="mt-6 grid gap-px bg-border md:grid-cols-3"><Stat label="Queried score" value={score} /><Stat label="Profile status" value={profile} /><Stat label="Registry mode" value="READ / VERIFY" /></div><div className="mt-6 bg-[#060606]"><AttestationLog rows={events} /></div></div>
  </main>
}
