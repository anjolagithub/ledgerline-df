'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Contract, JsonRpcProvider } from 'ethers'
import { ArrowUpRight, Check, ChevronRight, Network } from 'lucide-react'

const CC3_RPC = 'https://rpc.cc3-testnet.creditcoin.network'
const REGISTRY = '0xde8365dAF3CFdF952E2F946F19a4DcAcd57eFf0F'
const ABI = ['function getCreditProfile(address) view returns (tuple(uint16 score, uint256 totalVerifiedRepayments, uint256 completedLoanCount, uint256 lastUpdated))']
const EXAMPLE = '0x00dC0f3ff1F2bca6b3d007684cC25a766c9815f4'

const proofRows = [
  ['01', 'Repayment observed', 'Ethereum Sepolia', 'verified'],
  ['02', 'Receipt decoded', 'Block 7,921,443', 'verified'],
  ['03', 'Merkle proof anchored', 'Creditcoin CC3', 'verified'],
]

export default function Page() {
  const [score, setScore] = useState('—')
  useEffect(() => {
    const provider = new JsonRpcProvider(CC3_RPC)
    new Contract(REGISTRY, ABI, provider).getCreditProfile(EXAMPLE).then((p) => setScore(String(p.score))).catch(() => setScore('n/a'))
  }, [])

  return <main className="min-h-screen bg-[#030303] text-slate-300">
    <header className="mx-auto flex max-w-[1440px] items-center justify-between border-x border-[#1a1a1a] px-5 py-5 lg:px-10">
      <Link href="/" className="flex items-center gap-3 text-[13px] font-semibold tracking-[.2em] text-slate-100"><span className="grid h-7 w-7 place-items-center bg-emerald-400 text-[#030303]"><Network size={14}/></span>LEDGERLINE</Link>
      <Link href="/dashboard" className="group flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.18em] text-slate-500 hover:text-emerald-400">Open Core <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/></Link>
    </header>
    <div className="mx-auto max-w-[1440px] border-x border-[#1a1a1a]">
      <section className="relative overflow-hidden border-b border-[#1a1a1a] px-5 pb-20 pt-20 lg:px-16 lg:pb-32 lg:pt-28">
        <div className="pointer-events-none absolute inset-0 opacity-[.18] [background-image:linear-gradient(120deg,transparent_0%,rgba(16,185,129,.12)_45%,transparent_72%)]" />
        <div className="relative max-w-4xl"><p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[.24em] text-emerald-400"><span className="h-1.5 w-1.5 bg-emerald-400"/>Credit infrastructure / live registry</p><h1 className="mt-8 text-balance text-6xl font-semibold leading-[.91] tracking-[-.07em] text-slate-100 sm:text-8xl lg:text-[9rem]">Credit history,<br/><span className="text-emerald-400">proven.</span></h1><p className="mt-8 max-w-xl text-[15px] leading-7 text-slate-500">LedgerLine turns repayment evidence into a portable, cryptographically verified credit record across Ethereum and Creditcoin.</p><div className="mt-10 flex flex-wrap gap-3"><Link href="/dashboard" className="inline-flex items-center gap-3 bg-emerald-400 px-5 py-3 font-mono text-[11px] uppercase tracking-[.12em] text-[#030303] hover:bg-emerald-300">Enter LedgerLine Core <ChevronRight size={14}/></Link><span className="inline-flex items-center border border-[#2a2a2a] px-5 py-3 font-mono text-[11px] uppercase tracking-[.12em] text-slate-500">Attestcoin protocol</span></div></div>
      </section>
      <section className="grid border-b border-[#1a1a1a] sm:grid-cols-3"><div className="border-b border-[#1a1a1a] p-6 sm:border-b-0 sm:border-r lg:p-8"><p className="font-mono text-3xl text-emerald-400">24/24</p><p className="mt-2 font-mono text-[10px] uppercase tracking-[.16em] text-slate-600">Unit tests passing</p></div><div className="border-b border-[#1a1a1a] p-6 sm:border-b-0 sm:border-r lg:p-8"><p className="font-mono text-3xl text-slate-100">{score}</p><p className="mt-2 font-mono text-[10px] uppercase tracking-[.16em] text-slate-600">Live profile score</p></div><div className="p-6 lg:p-8"><p className="font-mono text-3xl text-slate-100">02</p><p className="mt-2 font-mono text-[10px] uppercase tracking-[.16em] text-slate-600">Connected environments</p></div></section>
      <section className="grid gap-px bg-[#1a1a1a] lg:grid-cols-[.7fr_1.3fr]"><div className="bg-[#030303] p-6 lg:p-10"><p className="font-mono text-[10px] uppercase tracking-[.22em] text-slate-600">Proof architecture</p><h2 className="mt-5 max-w-xs text-3xl font-semibold tracking-[-.04em] text-slate-100">A clean trail from event to score.</h2></div><div className="bg-[#080808]">{proofRows.map(([n, title, detail]) => <div key={n} className="grid grid-cols-[42px_1fr_auto] items-center gap-4 border-b border-[#1a1a1a] px-6 py-5 last:border-0 lg:px-10"><span className="font-mono text-[10px] text-emerald-400">{n}</span><div><p className="text-sm text-slate-200">{title}</p><p className="mt-1 font-mono text-[10px] text-slate-600">{detail}</p></div><Check size={14} className="text-emerald-400"/></div>)}</div></section>
    </div>
    <footer className="mx-auto flex max-w-[1440px] justify-between border-x border-[#1a1a1a] px-5 py-6 font-mono text-[10px] uppercase tracking-[.16em] text-slate-700 lg:px-10"><span>LedgerLine Core</span><span>Sepolia / CC3</span></footer>
  </main>
}
