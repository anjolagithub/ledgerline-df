import Link from 'next/link'
import { ArrowUpRight, ExternalLink, ShieldCheck } from 'lucide-react'
import { ProductShell, SectionHeader } from '../../components/ProductShell'

const stages = [
  ['01', 'SOURCE EVENT', 'Ethereum Sepolia', 'Awaiting a real source transaction hash', 'PENDING'],
  ['02', 'ATTESTCOIN', 'Attestation integration', 'No live Attestcoin verifier is configured in this demo', 'DEMO'],
  ['03', 'VERIFIED FINANCIAL EVIDENCE', 'LedgerLine network', 'Evidence is only verified after a real source event is queried', 'PENDING'],
  ['04', 'LEDGERLINE CREDIT EVENT', 'Creditcoin CC3', 'Registry reads are available; writes require an approved flow', 'TESTNET'],
  ['05', 'CREDIT PROFILE UPDATE', 'Creditcoin CC3', 'Inspect a connected profile to read the current score', 'TESTNET'],
]

export default function Verification() {
  return <ProductShell><SectionHeader eyebrow="LedgerLine / verification" title="Proof before credit." description="Trace source-chain activity into portable credit intelligence. Every stage is labeled by its actual data state."/><section className="border border-border bg-[#060606] p-5 lg:p-8"><div className="mb-6 flex items-center gap-3 border-b border-border pb-5"><ShieldCheck size={17} className="text-primary"/><div><p className="font-mono text-[10px] uppercase tracking-[.14em] text-primary">Verification lifecycle</p><p className="mt-1 text-xs text-slate-600">No fabricated hashes, attestations, or confirmations.</p></div></div><div className="divide-y divide-border font-mono text-xs">{stages.map(([n,title,chain,detail,status])=><div key={n} className="grid gap-3 py-5 md:grid-cols-[44px_1.2fr_180px_1.4fr_90px] md:items-center"><span className="text-slate-600">{n}</span><span className="text-slate-200">{title}</span><span className="text-slate-500">{chain}</span><span className="text-slate-600">{detail}</span><span className={status === 'TESTNET' ? 'text-amber-400' : status === 'DEMO' ? 'text-slate-400' : 'text-primary'}>{status}</span></div>)}</div></section><div className="mt-6 flex flex-wrap gap-5 font-mono text-[10px] uppercase tracking-[.12em] text-slate-600"><span className="text-primary">VERIFIED = CONTRACT READ</span><span className="text-amber-400">TESTNET = LIVE NETWORK</span><span>DEMO = UI ONLY</span></div><div className="mt-8 flex flex-wrap gap-5"><Link href="/credit-profile" className="inline-flex items-center gap-2 border border-primary px-4 py-3 font-mono text-[10px] uppercase tracking-[.12em] text-primary">Query real profile <ArrowUpRight size={13}/></Link><a href="https://github.com/anjolagithub/ledgerline-core" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[.12em] text-slate-500 hover:text-slate-200">Inspect source <ExternalLink size={13}/></a></div></ProductShell>
}
