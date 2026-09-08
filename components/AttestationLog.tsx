'use client'

import { useState } from 'react'
import { Copy, ExternalLink, RefreshCw } from 'lucide-react'
import type { LogRow } from '../lib/ledgerline'
import { EXPLORERS } from '../lib/contracts'

export function AttestationLog({ rows }: { rows: LogRow[] }) {
  const [copied, setCopied] = useState('')
  return <section className="border-t border-border">
    <div className="flex items-center justify-between border-b border-border px-5 py-4"><div><p className="eyebrow text-primary">LedgerLine / audit stream</p><h2 className="mt-2 text-xs font-semibold text-slate-200">Attestation receipts</h2></div><RefreshCw size={14} className="text-slate-600" /></div>
    <div className="divide-y divide-border">{rows.length === 0 && <div className="px-5 py-8 font-mono text-[10px] uppercase tracking-[.1em] text-slate-600">No live receipts returned from the configured networks.</div>}{rows.slice(-8).reverse().map(row => <div key={`${row.hash}-${row.event}`} className="grid gap-2 px-5 py-3 font-mono text-[10px] md:grid-cols-[90px_1fr_1fr_auto] md:items-center"><span className="text-primary">{row.chain.toUpperCase()}</span><span className="text-slate-400">{row.event}<small className="ml-2 text-slate-700">{row.blockNumber ? `BLOCK ${row.blockNumber}` : ''}</small></span><button onClick={() => { navigator.clipboard?.writeText(row.hash); setCopied(row.hash) }} className="flex items-center gap-2 text-left text-slate-600 hover:text-primary"><span className="truncate">{copied === row.hash ? 'COPIED' : `${row.hash.slice(0, 12)}…${row.hash.slice(-8)}`}</span><Copy size={11} /></button><a href={`${EXPLORERS[row.chain]}/tx/${row.hash}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:text-emerald-300" aria-label={`Open ${row.event} on explorer`}><ExternalLink size={12}/><span className="hidden sm:inline">OPEN</span></a></div>)}</div>
  </section>
}
