'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Contract, JsonRpcProvider, formatUnits, isAddress } from 'ethers'
import { ArrowRight, CheckCircle2, CircleAlert, Network } from 'lucide-react'

const CC3_RPC = 'https://rpc.cc3-testnet.creditcoin.network'
const REGISTRY = '0xde8365dAF3CFdF952E2F946F19a4DcAcd57eFf0F'
const ABI = ['function getCreditProfile(address) view returns (tuple(uint16 score, uint256 totalVerifiedRepayments, uint256 completedLoanCount, uint256 lastUpdated))']
const EXAMPLE = '0x00dC0f3ff1F2bca6b3d007684cC25a766c9815f4'

export default function Page() {
  const [score, setScore] = useState<string | null>(null)
  const [state, setState] = useState('Reading CC3 registry…')

  useEffect(() => {
    const load = async () => {
      try {
        const profile = await new Contract(REGISTRY, ABI, new JsonRpcProvider(CC3_RPC)).getCreditProfile(EXAMPLE)
        setScore(String(profile.score))
        setState('Example verified profile')
      } catch {
        setState('Profile unavailable')
      }
    }
    load()
  }, [])

  return <main className="min-h-screen bg-[#030303] text-slate-300 selection:bg-emerald-400/20">
    <nav className="mx-auto flex max-w-7xl items-center justify-between border-b border-[#1A1A1A] px-6 py-5 lg:px-10">
      <Link href="/" className="flex items-center gap-3 text-sm font-semibold tracking-[0.08em] text-slate-100"><span className="flex h-7 w-7 items-center justify-center border border-emerald-400/50 text-emerald-400"><Network size={14}/></span>LEDGERLINE</Link>
      <Link href="/dashboard" className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500 hover:text-emerald-400">Open Core <ArrowRight className="ml-2 inline" size={13}/></Link>
    </nav>
    <section className="mx-auto max-w-7xl border-x border-[#1A1A1A] px-6 py-24 lg:px-16 lg:py-36">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-emerald-400">CROSS-CHAIN CREDIT REGISTRY / CORE</p>
      <h1 className="mt-8 max-w-4xl text-balance text-6xl font-semibold leading-[0.96] tracking-[-0.06em] text-slate-100 sm:text-8xl">Credit history,<br/><span className="text-emerald-400">proven.</span></h1>
      <p className="mt-8 max-w-xl text-sm leading-7 text-slate-500">LedgerLine is a cross-chain credit registry built on Creditcoin&apos;s Attestcoin Protocol. Repayment evidence becomes a portable, cryptographically verifiable record.</p>
      <Link href="/dashboard" className="mt-10 inline-flex items-center gap-3 border border-emerald-400/50 bg-emerald-400/10 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-emerald-400 hover:bg-emerald-400/20">Enter LedgerLine Core <ArrowRight size={14}/></Link>
    </section>
    <section className="mx-auto grid max-w-7xl border-x border-y border-[#1A1A1A] sm:grid-cols-2">
      <div className="border-b border-[#1A1A1A] p-6 sm:border-b-0 sm:border-r lg:p-10"><p className="font-mono text-4xl text-emerald-400">24/24</p><p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">Foundry unit tests passing</p></div>
      <div className="p-6 lg:p-10"><p className="font-mono text-4xl text-slate-100">{score ?? '—'}</p><div className="mt-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">{score ? <CheckCircle2 size={12} className="text-emerald-400"/> : <CircleAlert size={12}/>} {state}</div></div>
    </section>
    <footer className="mx-auto flex max-w-7xl justify-between border-x border-[#1A1A1A] px-6 py-6 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-700 lg:px-10"><span>LedgerLine Core</span><span>Sepolia / CC3 Testnet</span></footer>
  </main>
}
