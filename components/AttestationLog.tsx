'use client'

import { useState } from 'react'
import { Copy, RefreshCw } from 'lucide-react'
import type { LogRow } from '../lib/ledgerline'

export function AttestationLog({ rows }: { rows: LogRow[] }) {
  const [copied, setCopied] = useState('')
  return <section className="border-t border-border">
    <div className="flex items-center justify-between border-b border-border px-5 py-4"><div><p className="eyebrow text-primary">LedgerLine / audit stream</p><h2 className="mt-2 text-xs font-semibold text-slate-200">Attestation receipts</h2></div><RefreshCw size={14} className="text-slate-600" /></div>
    <div className="divide-y divide-border">{rows.slice(-8).reverse().map(row => <div key={`${row.hash}-${row.event}`} className="grid gap-2 px-5 py-3 font-mono text-[10px] md:grid-cols-[90px_1fr_120px] md:items-center"><span className="text-primary">{row.chain.toUpperCase()}</span><span className="text-slate-400">{row.event}</span><button onClick={() => { navigator.clipboard?.writeText(row.hash); setCopied(row.hash) }} className="flex items-center gap-2 text-left text-slate-600 hover:text-primary"><span className="truncate">{copied === row.hash ? 'COPIED' : `${row.hash.slice(0, 12)}…${row.hash.slice(-8)}`}</span><Copy size={11} /></button></div>)}</div>
  </section>
}
