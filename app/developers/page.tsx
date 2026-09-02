import { ExternalLink } from 'lucide-react'
import { ProductShell, SectionHeader } from '../../components/ProductShell'
import { ADDRESSES, CHAIN_IDS, EXPLORERS } from '../../lib/contracts'

const contracts = [
  ['Ethereum Sepolia', 'LedgerLineSourceRegistry', ADDRESSES.sourceRegistry],
  ['Ethereum Sepolia', 'LedgerLineSourceSettlement', ADDRESSES.sourceSettlement],
  ['Creditcoin CC3 Testnet', 'LedgerLineRegistry', ADDRESSES.registry],
  ['Creditcoin CC3 Testnet', 'LedgerLineProofVerifier', ADDRESSES.proofVerifier],
  ['Creditcoin CC3 Testnet', 'LedgerLineReadabilityManager', ADDRESSES.manager],
  ['Creditcoin CC3 Testnet', 'LedgerLineFinancing', ADDRESSES.financing],
]

export default function Developers() {
  return <ProductShell><SectionHeader eyebrow="LedgerLine / developers" title="Build on verified credit evidence." description="LedgerLine verifies source-chain financial events through Creditcoin Attestcoin and Block Prover infrastructure. Proof generation and submission remain an off-chain relayer responsibility."/><section className="grid gap-px bg-border md:grid-cols-2"><pre className="overflow-auto bg-[#060606] p-6 font-mono text-xs leading-6 text-slate-400">{`GET /v1/credit-profiles/:address\nGET /v1/attestations/:hash\nGET /v1/networks/status`}</pre><div className="bg-[#080808] p-6"><p className="eyebrow text-primary">Network primitives</p><p className="mt-5 text-sm leading-6 text-slate-500">Sepolia chain ID {CHAIN_IDS.sepolia} → CC3 chain ID {CHAIN_IDS.cc3}. Native Block Prover precompile: {ADDRESSES.blockProver}</p><p className="mt-4 font-mono text-[10px] uppercase tracking-[.12em] text-amber-400">Frontend reads deployed contracts; relayer submits proofs.</p></div></section><section className="mt-8 border border-border bg-[#060606] p-5"><div className="mb-5"><p className="eyebrow text-primary">Deployed architecture</p><p className="mt-2 text-xs text-slate-600">TESTNET · STATIC CONTRACT DIRECTORY</p></div><div className="divide-y divide-border font-mono text-xs">{contracts.map(([network, name, address]) => <div key={name} className="grid gap-2 py-4 md:grid-cols-[1fr_1.3fr_1.5fr]"><span className="text-slate-600">{network}</span><span className="text-slate-300">{name}</span><span className={address === 'NOT CONFIGURED' ? 'text-amber-400' : 'break-all text-slate-500'}>{address}</span></div>)}</div></section><a href="https://github.com/anjolagithub/ledgerline-core" target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 text-[10px] uppercase tracking-[.12em] text-primary">Inspect contracts on GitHub <ExternalLink size={13}/></a></ProductShell>
}
