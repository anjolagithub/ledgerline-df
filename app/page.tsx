'use client'

import Link from 'next/link'
import { ArrowRight, ArrowRightLeft, FileCheck2, ShieldCheck, TrendingUp } from 'lucide-react'

const proof = [
  ['24/24', 'Verification tests passing'],
  ['2', 'Network environments'],
  ['515', 'Credit proofs issued'],
  ['0', 'Oracle dependencies'],
]

const steps = [
  [ArrowRightLeft, 'Repayment recorded', 'A transaction settles on Ethereum Sepolia.'],
  [FileCheck2, 'Proof generated', 'Attestcoin creates a Merkle and continuity proof.'],
  [ShieldCheck, 'Proof verified', 'Creditcoin verifies the receipt without an oracle.'],
  [TrendingUp, 'Credit updated', 'A durable, portable score is written on-chain.'],
]

export default function Page() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-slate-300 selection:bg-emerald-400/20">
      <nav className="mx-auto flex max-w-6xl items-center justify-between border-b border-white/[0.07] px-6 py-5 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-sm font-semibold tracking-tight text-slate-100"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-sm font-black text-[#06120e]">L</span>LedgerLine<span className="text-emerald-400">/</span></Link>
        <Link href="/dashboard" className="text-xs font-medium text-slate-500 transition hover:text-emerald-400">Open LedgerLine dashboard <ArrowRight className="ml-1 inline" size={13}/></Link>
      </nav>

      <section className="mx-auto max-w-6xl px-6 pb-24 pt-24 lg:px-8 lg:pb-32 lg:pt-36">
        <div className="max-w-5xl"><p className="mb-8 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-400">LedgerLine protocol registry</p><h1 className="max-w-4xl text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.06em] text-slate-100 sm:text-7xl lg:text-[96px]">Credit history, proven.</h1><p className="mt-8 max-w-2xl text-pretty text-base leading-7 text-slate-500 sm:text-lg">LedgerLine turns real repayment activity into a portable, cryptographically verifiable credit record across chains. Built on Creditcoin&apos;s Attestcoin Protocol.</p><div className="mt-10"><Link href="/dashboard" className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-5 py-3 text-sm font-semibold text-[#06120e] transition hover:bg-emerald-400">Open dashboard <ArrowRight size={15}/></Link></div></div>
      </section>

      <section className="border-y border-white/[0.07] bg-[#0d0d0d]" aria-label="LedgerLine verification metrics"><div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-white/[0.07] lg:grid-cols-4 lg:px-8">{proof.map(([value, label]) => <div key={label} className="border-b border-white/[0.07] px-6 py-7 odd:border-r last:border-b-0 lg:border-b-0 lg:px-8 lg:py-9"><p className="font-mono text-3xl font-medium tracking-tight text-emerald-400 sm:text-4xl">{value}</p><p className="mt-2 max-w-[150px] text-xs leading-5 text-slate-500">{label}</p></div>)}</div></section>

      <section className="mx-auto max-w-6xl px-6 py-24 lg:px-8 lg:py-32"><div className="mb-12"><p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">How LedgerLine works</p><h2 className="text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl">Evidence becomes credit.</h2></div><div className="grid gap-8 md:grid-cols-4">{steps.map(([Icon, title, description], i) => { const StepIcon = Icon as typeof ArrowRightLeft; return <div key={title} className="border-l border-white/10 pl-5"><span className="mb-6 block font-mono text-[10px] text-slate-700">0{i + 1}</span><StepIcon size={20} className="mb-5 text-emerald-400"/><h3 className="text-sm font-semibold text-slate-200">{title}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{description}</p></div>})}</div></section>

      <section className="mx-auto max-w-6xl px-6 pb-24 lg:px-8 lg:pb-32"><div className="mb-8"><p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">LedgerLine access</p><h2 className="text-3xl font-semibold tracking-tight text-slate-100">One record. Any reader.</h2></div><div className="grid gap-4 md:grid-cols-2"><div className="rounded-xl border border-white/[0.08] bg-[#171717] p-7 sm:p-8"><h3 className="text-lg font-semibold text-slate-100">For borrowers</h3><p className="mt-3 max-w-md text-sm leading-6 text-slate-500">Repay on-chain and build a verifiable credit trail that remains yours across networks.</p></div><div className="rounded-xl border border-white/[0.08] bg-[#171717] p-7 sm:p-8"><h3 className="text-lg font-semibold text-slate-100">For lenders</h3><p className="mt-3 max-w-md text-sm leading-6 text-slate-500">Read repayment evidence directly from the chain and make decisions from records, not promises.</p></div></div></section>

      <footer className="border-t border-white/[0.07] px-6 py-7 lg:px-8"><div className="mx-auto flex max-w-6xl flex-col gap-2 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between"><span>LedgerLine protocol registry</span><Link href="/dashboard" className="transition hover:text-emerald-400">Dashboard <ArrowRight className="ml-1 inline" size={12}/></Link></div></footer>
    </main>
  )
}
