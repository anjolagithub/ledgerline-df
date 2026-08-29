'use client'

import { useState } from 'react'
import { ChevronDown, Play, CheckCircle2, Loader2 } from 'lucide-react'

const stages = [
  ['01', 'Receipt decoded', '{ "receipt": "sepolia:0x7a2…", "status": "success" }'],
  ['02', 'Continuity proof verified', '{ "merkle": "0x91c…", "parent": "0x441…" }'],
  ['03', 'Credit score anchored', '{ "registry": "ledgerline", "state": "final" }'],
]

export function RepaymentAudit() {
  const [amount, setAmount] = useState('100')
  const [chain, setChain] = useState('Ethereum Sepolia')
  const [running, setRunning] = useState(false)
  const [step, setStep] = useState(-1)
  const [open, setOpen] = useState<number | null>(null)
  const run = () => { setRunning(true); setStep(0); stages.forEach((_, i) => setTimeout(() => setStep(i), (i + 1) * 900)); setTimeout(() => setRunning(false), 3000) }
  return <section className="border border-border bg-[#060606] p-5"><div className="flex items-start justify-between"><div><p className="eyebrow text-primary">LedgerLine / audit intake</p><h2 className="mt-2 text-sm font-semibold text-slate-200">Replay repayment receipt</h2><p className="mt-2 max-w-md text-xs leading-5 text-slate-600">Decode a repayment event, verify continuity, and anchor the resulting credit state.</p></div><Play size={15} className="text-primary" /></div><div className="mt-6 grid gap-3 sm:grid-cols-[1fr_1fr_auto]"><label className="font-mono text-[10px] text-slate-600">AMOUNT<input value={amount} onChange={e => setAmount(e.target.value)} inputMode="decimal" className="mt-2 block w-full border border-border bg-black px-3 py-2 text-xs text-slate-200 outline-none focus:border-primary" /></label><label className="font-mono text-[10px] text-slate-600">SOURCE<select value={chain} onChange={e => setChain(e.target.value)} className="mt-2 block w-full border border-border bg-black px-3 py-2 text-xs text-slate-200 outline-none focus:border-primary"><option>Ethereum Sepolia</option><option>Creditcoin CC3</option></select></label><button onClick={run} disabled={running || Number(amount) <= 0} className="mt-auto flex items-center justify-center gap-2 bg-primary px-4 py-2 font-mono text-[10px] uppercase tracking-[.12em] text-black disabled:opacity-50">{running ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} />}{running ? 'Proving…' : 'Run proof'}</button></div><div className="mt-6 divide-y divide-border border-t border-border">{stages.map(([id, label, payload], i) => <div key={id} className="py-3"><button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center gap-3 text-left font-mono text-[10px]"><span className={step >= i ? 'text-primary' : 'text-slate-600'}>{step >= i ? <CheckCircle2 size={14} /> : id}</span><span className="flex-1 text-slate-300">{label}</span><ChevronDown size={13} className={`text-slate-600 transition-transform ${open === i ? 'rotate-180' : ''}`} /></button>{open === i && <pre className="mt-3 overflow-auto border-l border-primary/30 pl-7 font-mono text-[10px] leading-5 text-slate-500">{payload}</pre>}</div>)}</div></section>
}
