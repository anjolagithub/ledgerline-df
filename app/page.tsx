'use client'

import Link from 'next/link'
import { ArrowRight, ArrowRightLeft, FileCheck2, GitBranch, ShieldCheck, TrendingUp } from 'lucide-react'

const proof = [
  ['24/24', 'Foundry tests passing'],
  ['2', 'Live testnet deployments'],
  ['515', 'Verified credit score produced'],
  ['0', 'Centralized oracles used'],
]

const steps = [
  [ArrowRightLeft, 'Repayment occurs', 'On Ethereum Sepolia'],
  [FileCheck2, 'Proof generated', 'Merkle + continuity proof via Attestcoin'],
  [ShieldCheck, 'Verified on-chain', "Creditcoin's Block Prover precompile, no oracle"],
  [TrendingUp, 'Score updates', 'Automatic, tamper-proof, on Creditcoin'],
]

export default function Page() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-slate-300 selection:bg-emerald-400/20">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-sm font-semibold tracking-tight text-slate-100">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-[#06120e]">L</span>
          LedgerLine<span className="text-emerald-400">/</span>
        </Link>
        <div className="flex items-center gap-5 text-xs text-slate-500"><Link href="/dashboard" className="hover:text-slate-200">Dashboard</Link><a href="https://github.com" className="hidden hover:text-slate-200 sm:block">GitHub</a></div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 pb-24 pt-20 lg:px-8 lg:pb-32 lg:pt-28">
        <div className="max-w-4xl">
          <div className="mb-7 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400"><span className="relative flex h-2 w-2"><span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400/60"/><span className="relative h-2 w-2 rounded-full bg-emerald-400"/></span>Attestation live</div>
          <h1 className="max-w-4xl text-balance text-5xl font-semibold leading-[1.04] tracking-[-0.05em] text-slate-100 sm:text-7xl lg:text-[92px]">A credit history proven, not promised.</h1>
          <p className="mt-8 max-w-2xl text-pretty text-base leading-7 text-slate-500 sm:text-lg">LedgerLine is a cross-chain credit registry built on Creditcoin&apos;s Attestcoin Protocol. A real repayment on Ethereum Sepolia, cryptographically verified, becomes a real credit score on Creditcoin — no oracle, no self-reported data.</p>
          <div className="mt-10 flex flex-wrap items-center gap-3"><Link href="/dashboard" className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-5 py-3 text-sm font-semibold text-[#06120e] transition hover:bg-emerald-400">View Live Dashboard <ArrowRight size={15}/></Link><a href="https://github.com" className="inline-flex items-center gap-2 rounded-md border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-emerald-400/40 hover:text-slate-100"><GitBranch size={15}/> View on GitHub</a></div>
        </div>
      </section>

      <section className="border-y border-white/[0.07] bg-[#0d0d0d]" aria-label="Proof strip"><div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-white/[0.07] lg:grid-cols-4 lg:px-8">{proof.map(([value, label]) => <div key={label} className="border-b border-white/[0.07] px-6 py-7 last:border-b-0 odd:border-r lg:border-b-0 lg:px-8 lg:py-9"><p className="font-mono text-3xl font-medium tracking-tight text-emerald-400 sm:text-4xl">{value}</p><p className="mt-2 max-w-[150px] text-xs leading-5 text-slate-500">{label}</p></div>)}</div></section>

      <section className="mx-auto max-w-6xl px-6 py-24 lg:px-8 lg:py-32"><div className="mb-12 flex items-end justify-between gap-6"><div><p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">The protocol</p><h2 className="text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl">Evidence moves through the system.</h2></div></div><div className="grid gap-8 md:grid-cols-4">{steps.map(([Icon, title, description], i) => { const StepIcon = Icon as typeof ArrowRightLeft; return <div key={title} className="relative border-l border-white/10 pl-5"><span className="mb-6 block font-mono text-[10px] text-slate-700">0{i + 1}</span><StepIcon size={20} className="mb-5 text-emerald-400"/><h3 className="text-sm font-semibold text-slate-200">{title}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{description}</p></div>})}</div></section>

      <section className="mx-auto max-w-6xl px-6 pb-24 lg:px-8 lg:pb-32"><div className="mb-8"><p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">Built for both sides</p><h2 className="text-3xl font-semibold tracking-tight text-slate-100">A credit trail that travels.</h2></div><div className="grid gap-4 md:grid-cols-2"><div className="rounded-xl border border-white/[0.08] bg-[#171717] p-7 sm:p-8"><h3 className="text-lg font-semibold text-slate-100">Web3-native</h3><p className="mt-3 max-w-md text-sm leading-6 text-slate-500">Connect a wallet, register, fund, and repay loans directly, then read scores on-chain.</p></div><div className="rounded-xl border border-white/[0.08] bg-[#171717] p-7 sm:p-8"><h3 className="text-lg font-semibold text-slate-100">Web2 fintechs</h3><p className="mt-3 max-w-md text-sm leading-6 text-slate-500">Represent real-world lending activity on Sepolia and get a cryptographically verifiable credit trail — no wallet or crypto tooling required to read the score.</p></div></div></section>

      <footer className="border-t border-white/[0.07] px-6 py-7 lg:px-8"><div className="mx-auto flex max-w-6xl flex-col gap-4 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-slate-400">LedgerLine — built for BUIDL CTC 2026 Fall</p><p className="mt-1">Deployed on Ethereum Sepolia and Creditcoin CC3 Testnet</p></div><div className="flex items-center gap-4"><a href="https://github.com" className="hover:text-emerald-400">GitHub</a><Link href="/dashboard" className="hover:text-emerald-400">Dashboard</Link><a href="#" className="hover:text-emerald-400">Demo Video</a></div></div></footer>
    </main>
  )
}
