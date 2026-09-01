'use client'

import { useState } from 'react'
import { ChevronDown, Info, Play } from 'lucide-react'

const stages = [
  ['01', 'Receipt decoded', '{ "receipt": "provided source hash", "status": "awaiting input" }'],
  ['02', 'Attestcoin verification', '{ "merkle": "not queried", "continuity": "not queried" }'],
  ['03', 'LedgerLine credit event', '{ "registry": "not written", "state": "demo only" }'],
] as const

export function RepaymentAudit() {
  const [amount, setAmount] = useState('100')
  const [chain, setChain] = useState('Ethereum Sepolia')
  const [hash, setHash] = useState('')
  const [open, setOpen] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const run = () => {
    setError('')
    if (!/^0x[a-fA-F0-9]{64}$/.test(hash.trim())) {
      setError('Enter a real 32-byte source transaction hash. No proof was run.')
      return
    }
    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      setError('Enter a positive repayment amount.')
      return
    }
    setSubmitted(true)
  }

  return <section className="border border-border bg-[#060606] p-5">
    <div className="flex items-start justify-between gap-4">
      <div><p className="eyebrow text-primary">LedgerLine / demo intake</p><h2 className="mt-2 text-sm font-semibold text-slate-200">Replay repayment receipt</h2><p className="mt-2 max-w-md text-xs leading-5 text-slate-600">Capture source evidence for review. This interface does not claim an Attestcoin verification unless a real integration is connected.</p></div><Info size={15} className="shrink-0 text-slate-500" aria-label="Demo flow" />
    </div>
    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_2fr_auto]">
      <label className="font-mono text-[10px] text-slate-600">AMOUNT<input value={amount} onChange={e => setAmount(e.target.value)} inputMode="decimal" className="mt-2 block w-full border border-border bg-black px-3 py-2 text-xs text-slate-200 outline-none focus:border-primary" /></label>
      <label className="font-mono text-[10px] text-slate-600">SOURCE<select value={chain} onChange={e => setChain(e.target.value)} className="mt-2 block w-full border border-border bg-black px-3 py-2 text-xs text-slate-200 outline-none focus:border-primary"><option>Ethereum Sepolia</option><option>Creditcoin CC3</option></select></label>
      <label className="font-mono text-[10px] text-slate-600 sm:col-span-2 lg:col-span-1">SOURCE TRANSACTION HASH<input value={hash} onChange={e => { setHash(e.target.value); setSubmitted(false); setError('') }} placeholder="0x + 64 hex characters" className="mt-2 block w-full border border-border bg-black px-3 py-2 text-xs text-slate-200 outline-none placeholder:text-slate-700 focus:border-primary" /></label>
      <button onClick={run} className="mt-auto flex items-center justify-center gap-2 bg-primary px-4 py-2 font-mono text-[10px] uppercase tracking-[.12em] text-black"><Play size={13} />{submitted ? 'Demo captured' : 'Capture evidence'}</button>
    </div>
    <p className="mt-3 font-mono text-[10px] text-slate-600">{submitted ? 'DEMO / TESTNET DATA · Evidence captured locally for review; no blockchain transaction was submitted.' : 'DEMO FLOW · Requires a real source hash before review.'}</p>
    {error && <p role="alert" className="mt-2 font-mono text-[10px] text-red-400">{error}</p>}
    <div className="mt-6 divide-y divide-border border-t border-border">{stages.map(([id, label, payload], i) => <div key={id} className="py-3"><button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex w-full items-center gap-3 text-left font-mono text-[10px]"><span className="text-slate-600">{id}</span><span className="flex-1 text-slate-300">{label}</span><span className="text-slate-600">{submitted ? 'DEMO' : 'PENDING'}</span><ChevronDown size={13} className={`text-slate-600 transition-transform ${open === i ? 'rotate-180' : ''}`} /></button>{open === i && <pre className="mt-3 overflow-x-auto border border-border bg-black p-3 font-mono text-[10px] leading-5 text-slate-500">{payload}</pre>}</div>)}</div>
  </section>
}
