'use client'

import { CheckCircle2, Copy, ExternalLink, Loader2, XCircle } from 'lucide-react'
import { useState } from 'react'
import { EXPLORERS } from '../lib/contracts'

type TransactionReceiptProps = {
  hash?: string
  chain: 'sepolia' | 'cc3'
  status: 'submitted' | 'confirmed' | 'failed'
  label?: string
  error?: string
}

export function TransactionReceipt({ hash, chain, status, label = 'Transaction', error }: TransactionReceiptProps) {
  const [copied, setCopied] = useState(false)
  const explorerUrl = hash ? `${EXPLORERS[chain]}/tx/${hash}` : undefined
  const copyHash = async () => {
    if (!hash) return
    await navigator.clipboard?.writeText(hash)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="border border-border bg-[#080808] p-4 font-mono text-[10px]" aria-live="polite">
      <div className="flex items-center gap-2 uppercase tracking-[.12em] text-slate-300">
        {status === 'submitted' && <Loader2 size={13} className="animate-spin text-primary" aria-hidden="true" />}
        {status === 'confirmed' && <CheckCircle2 size={13} className="text-primary" aria-hidden="true" />}
        {status === 'failed' && <XCircle size={13} className="text-red-400" aria-hidden="true" />}
        <span>{label}</span>
        <span className="ml-auto text-slate-600">{status}</span>
      </div>
      {hash && <div className="mt-3 flex flex-wrap items-center gap-2 text-slate-500">
        <span className="truncate">{hash.slice(0, 12)}…{hash.slice(-10)}</span>
        <button type="button" onClick={copyHash} className="inline-flex items-center gap-1 border border-border px-2 py-1 text-slate-400 hover:border-primary hover:text-primary" aria-label="Copy transaction hash"><Copy size={11} />{copied ? 'Copied' : 'Copy'}</button>
        {explorerUrl && <a href={explorerUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:text-emerald-300"><ExternalLink size={11} />Explorer</a>}
      </div>}
      {error && <p className="mt-3 break-words text-red-300">{error}</p>}
    </div>
  )
}
