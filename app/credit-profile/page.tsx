'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Search } from 'lucide-react'
import { ProductShell, SectionHeader } from '../../components/ProductShell'
import { EXAMPLE_ADDRESS } from '../../lib/contracts'
import { getCreditProfile } from '../../lib/ledgerline'

export default function CreditProfile() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('Enter a wallet address to begin.')
  const [profile, setProfile] = useState<{ score: string; repayments: string; loans: string } | null>(null)
  const [busy, setBusy] = useState(false)
  async function lookup() { const address = query.trim() || EXAMPLE_ADDRESS; setBusy(true); setStatus('Reading LedgerLine network evidence…'); try { const result = await getCreditProfile(address); setProfile({ score: String(result.score), repayments: result.totalVerifiedRepayments, loans: String(result.completedLoanCount) }); setStatus('LIVE / ON-CHAIN · Profile returned from Creditcoin CC3 Testnet / LedgerLineRegistry.') } catch { setProfile(null); setStatus('UNAVAILABLE · Unable to read LedgerLineRegistry on Creditcoin CC3 Testnet.') } finally { setBusy(false) } }
  return <ProductShell><SectionHeader eyebrow="LedgerLine / credit profile" title="One verified view of repayment behavior." description="Query an address and inspect the evidence that makes its score portable across LedgerLine network environments."/><section className="grid gap-px bg-border lg:grid-cols-[1.3fr_.7fr]"><div className="bg-[#060606] p-5 lg:p-10"><div className="flex border border-border"><input aria-label="Wallet address" value={query} onChange={event => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent px-4 py-4 font-mono text-xs text-slate-200 outline-none" placeholder="0x wallet address (optional example)"/><button onClick={lookup} disabled={busy} className="border-l border-border px-4 text-primary disabled:opacity-50" aria-label="Query credit profile">{busy ? '…' : <Search size={15}/>}</button></div><p className="mt-3 font-mono text-[10px] text-slate-600">{status}</p><div className="mt-8 grid grid-cols-2 gap-px bg-border md:grid-cols-4">{[[profile?.score ?? '—','Credit score'],[profile?.repayments ?? '—','Verified repayments'],[profile?.loans ?? '—','Completed loans'],[profile ? 'LIVE' : '—','Registry state']].map(([v,l])=><div key={l} className="bg-[#060606] p-4"><p className="font-mono text-2xl text-slate-100">{v}</p><p className="mt-2 font-mono text-[9px] uppercase tracking-[.1em] text-slate-600">{l}</p></div>)}</div></div><aside className="bg-[#080808] p-5 lg:p-10"><p className="eyebrow text-primary">Evidence chain</p><div className="mt-8 space-y-5 font-mono text-xs text-slate-500"><p>01 <span className="ml-4 text-slate-300">Receipt decoded</span></p><p>02 <span className="ml-4 text-slate-300">Continuity verified</span></p><p>03 <span className="ml-4 text-primary">Score anchored</span></p></div><Link href="/verification" className="mt-10 inline-flex items-center gap-2 text-[10px] uppercase tracking-[.12em] text-primary">Inspect verification <ArrowUpRight size={13}/></Link></aside></section></ProductShell>
}
