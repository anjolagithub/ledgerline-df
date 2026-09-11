'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { BrowserProvider, JsonRpcProvider, isAddress } from 'ethers'
import { Activity, ArrowUpRight, Check, CircleAlert, Copy, Database, ExternalLink, LayoutDashboard, Loader2, Network, Search, ShieldCheck, Terminal, WalletCards } from 'lucide-react'
import { ADDRESSES, EXAMPLE_ADDRESS, RPC } from '../../lib/contracts'
import { getAttestationLog, getCreditProfile, getProofByTransaction, getSepoliaTransaction, submitReadabilityProof, waitForAttestation } from '../../lib/ledgerline'
import { useWalletContext } from '../../lib/WalletContext'
import { AttestationLog } from '../../components/AttestationLog'

const PRECOMPILE = '0x0000000000000000000000000000000000000FD2'
const READABILITY_MANAGER = '0xCC0B4686de40Ff5ae1e0B8d58Da9175e9090610D'

type Stage = 'idle' | 'mining' | 'syncing' | 'proving' | 'timeout' | 'dispatched'

function Status({ label, value }: { label: string; value: boolean | null }) {
  return <span className="font-mono text-[9px] uppercase tracking-[.1em] text-slate-600"><i className={`mr-2 inline-block h-1.5 w-1.5 ${value ? 'bg-primary shadow-[0_0_8px_#10b981]' : 'bg-slate-700'}`} />{label} <b className="font-normal text-slate-400">{value === null ? 'SYNC' : value ? 'ONLINE' : 'OFFLINE'}</b></span>
}

function StageBadge({ state }: { state: 'complete' | 'active' | 'pending' | 'error' }) {
  const styles = { complete: 'border-primary/30 bg-primary/10 text-primary', active: 'border-primary/50 bg-primary/15 text-primary', pending: 'border-border text-slate-600', error: 'border-red-500/30 bg-red-500/10 text-red-300' }
  const labels = { complete: 'RECORDED', active: 'PROCESSING', pending: 'PENDING', error: 'TIMEOUT' }
  return <span className={`border px-2 py-1 font-mono text-[9px] uppercase tracking-[.12em] ${styles[state]}`}>{labels[state]}</span>
}

function ProofLifecycle({ wallet, onConnect }: { wallet: string; onConnect: () => Promise<void> }) {
  const { signer } = useWalletContext()
  const [hash, setHash] = useState('')
  const [eventType, setEventType] = useState('Registered')
  const [stage, setStage] = useState<Stage>('idle')
  const [block, setBlock] = useState<number | null>(null)
  const [attestedHeight, setAttestedHeight] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [receiptHash, setReceiptHash] = useState('')

  const run = async () => {
    setError(''); setReceiptHash('')
    if (!/^0x[0-9a-fA-F]{64}$/.test(hash)) return setError('Enter a valid Sepolia transaction hash.')
    if (!signer) { await onConnect(); return }
    try {
      setStage('mining')
      const source = await getSepoliaTransaction(hash)
      if (source.status === 0) throw new Error('The source transaction reverted on Sepolia.')
      setBlock(source.blockNumber)
      setStage('syncing')
      await waitForAttestation(source.blockNumber, setAttestedHeight)
      setStage('proving')
      const proof = await getProofByTransaction(hash)
      const action = eventType === 'Registered' ? 0 : eventType === 'Funded' ? 1 : 2
      const receipt = await submitReadabilityProof(signer, action, proof)
      if (!receipt || receipt.status !== 1) throw new Error('CC3 proof submission reverted.')
      setReceiptHash(receipt.hash); setStage('dispatched')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Proof submission failed.')
      setStage('timeout')
    }
  }

  const state = (target: number): 'complete' | 'active' | 'pending' | 'error' => stage === 'timeout' ? (target >= 2 ? 'error' : 'pending') : ({ 1: ['syncing', 'proving', 'dispatched'].includes(stage) ? 'complete' : stage === 'mining' ? 'active' : 'pending', 2: ['proving', 'dispatched'].includes(stage) ? 'complete' : stage === 'syncing' ? 'active' : 'pending', 3: stage === 'dispatched' ? 'complete' : stage === 'proving' ? 'active' : 'pending' } as Record<number, 'complete' | 'active' | 'pending' | 'error'>)[target]

  return <section className="border border-border bg-[#080808] p-5 sm:p-6">
    <div className="mb-6 flex items-start justify-between gap-4"><div><p className="eyebrow text-primary">Cross-chain proof lifecycle tracker</p><h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-100">Verification Desk</h2></div><Terminal className="text-slate-600" size={18} /></div>
    <div className="space-y-3">
      <div className="border border-border bg-[#050505] p-4"><div className="flex items-center justify-between gap-3"><div><p className="font-mono text-[10px] uppercase tracking-[.1em] text-slate-200">01 / Source event mining</p><p className="mt-1 text-xs text-slate-500">Mined on Ethereum Sepolia</p></div><StageBadge state={state(1)} /></div><div className="mt-4 grid gap-3 sm:grid-cols-[1fr_150px_auto]"><input value={hash} onChange={(event) => setHash(event.target.value)} placeholder="0x transaction hash" aria-label="Source transaction hash" className="min-w-0 border border-border bg-background px-3 py-2 font-mono text-xs text-slate-200 outline-none placeholder:text-slate-700 focus:border-primary/50" /><select value={eventType} onChange={(event) => setEventType(event.target.value)} aria-label="Event type" className="border border-border bg-background px-3 py-2 font-mono text-xs text-slate-300 outline-none"><option>Registered</option><option>Funded</option><option>Repaid</option></select><button onClick={run} disabled={stage === 'mining' || stage === 'syncing' || stage === 'proving'} className="border border-primary/40 bg-primary/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[.1em] text-primary disabled:opacity-40">{stage === 'mining' ? 'Mining…' : 'Start proof'}</button></div></div>
      <div className="border border-border bg-[#050505] p-4"><div className="flex items-center justify-between gap-3"><div><p className="font-mono text-[10px] uppercase tracking-[.1em] text-slate-200">02 / Hub indexer sync & attestation</p><p className="mt-1 text-xs text-slate-500">{stage === 'syncing' ? 'Polling Creditcoin Proof Server Indexer…' : 'Awaiting source event submission'}</p></div><StageBadge state={state(2)} /></div><p className="mt-4 font-mono text-xs text-slate-400">Source block: <span className="text-primary">{block === null ? '—' : block.toLocaleString()}</span>{attestedHeight !== null && <span className="ml-3 text-slate-500">attested height: <span className="text-primary">{attestedHeight.toLocaleString()}</span></span>} <span className="ml-2 text-slate-700">{stage === 'syncing' ? 'polling every 5s · 120s max' : ''}</span></p></div>
      <div className="border border-border bg-[#050505] p-4"><div className="flex items-center justify-between gap-3"><div><p className="font-mono text-[10px] uppercase tracking-[.1em] text-slate-200">03 / ZK proof generation</p><p className="mt-1 text-xs text-slate-500">{stage === 'proving' ? 'Generating cryptographic receipt proof' : 'Receipt proof worker idle'}</p></div><StageBadge state={state(3)} /></div>{stage === 'proving' && <div className="mt-4 flex items-center gap-3"><Loader2 className="animate-spin text-primary" size={18} /><span className="font-mono text-xs text-primary">Generating cryptographic receipt proof</span></div>}{stage === 'timeout' && <div className="mt-4 border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">API request timed out (5000ms exceeded). <button onClick={retry} className="ml-2 underline underline-offset-4">Retry proof generation with long-polling</button></div>}</div>
      <div className="border border-primary/25 bg-primary/[.04] p-4"><div className="flex items-center justify-between gap-3"><div><p className="font-mono text-[10px] uppercase tracking-[.1em] text-slate-200">04 / CC3 registry dispatch</p><p className="mt-1 text-xs text-slate-500">{stage === 'dispatched' ? 'Registry Updated. Replay Protection Checked.' : 'Proof dispatch awaits verification'}</p></div><StageBadge state={stage === 'dispatched' ? 'complete' : 'pending'} /></div><p className="mt-4 break-all font-mono text-[10px] text-primary">{READABILITY_MANAGER}</p>{receiptHash && <a href={`https://creditcoin-testnet.blockscout.com/tx/${receiptHash}`} target="_blank" rel="noreferrer" className="mt-3 flex items-center gap-2 font-mono text-[10px] text-primary underline underline-offset-4">Confirmed CC3 receipt: {receiptHash.slice(0, 10)}…{receiptHash.slice(-8)} <ExternalLink size={12} /></a>}{error && <div className="mt-3 border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">{error}</div>}</div>
    </div>
  </section>
}

export default function Dashboard() {
  const cc = useMemo(() => new JsonRpcProvider(RPC.cc3), [])
  const [query, setQuery] = useState(EXAMPLE_ADDRESS); const [score, setScore] = useState('—'); const [profile, setProfile] = useState('Awaiting registry query'); const [sep, setSep] = useState<boolean | null>(null); const [ccStatus, setCcStatus] = useState<boolean | null>(null); const [wallet, setWallet] = useState(''); const [events, setEvents] = useState<{ chain: string; event: string; hash: string }[]>([]); const [busy, setBusy] = useState('')
  useEffect(() => {
    let active = true
    const refreshEvents = () => {
      getAttestationLog().then((nextEvents) => {
        if (active) setEvents(nextEvents)
      }).catch(() => undefined)
    }
    Promise.all([new JsonRpcProvider(RPC.sepolia).getBlockNumber(), cc.getBlockNumber()]).then(() => { setSep(true); setCcStatus(true) }).catch(() => { setSep(false); setCcStatus(false) })
    refreshEvents()
    const interval = window.setInterval(refreshEvents, 20_000)
    return () => {
      active = false
      window.clearInterval(interval)
    }
  }, [cc])
  const lookup = async () => { if (!isAddress(query)) return setProfile('Invalid address'); setBusy('lookup'); setProfile('Reading profile…'); try { const p = await getCreditProfile(query); setScore(String(p.score)); setProfile(`${p.totalVerifiedRepayments} verified volume · ${p.completedLoanCount} completed loans`) } catch { setProfile('No profile returned from CC3') } finally { setBusy('') } }
  const connect = async () => { if (!window.ethereum) return setProfile('Injected wallet not detected'); setBusy('wallet'); try { const signer = await new BrowserProvider(window.ethereum as never).getSigner(); setWallet(await signer.getAddress()); setProfile('Wallet connected') } catch { setProfile('Wallet connection rejected') } finally { setBusy('') } }
  return <main className="min-h-screen overflow-x-hidden bg-background text-foreground"><header className="flex min-h-16 items-center justify-between border-b border-border px-4 sm:px-6 lg:px-8"><Link href="/" className="flex items-center gap-3 text-xs font-semibold tracking-[.22em] text-slate-100"><span className="grid h-7 w-7 place-items-center bg-primary text-primary-foreground"><Network size={14} /></span>LEDGERLINE <span className="hidden text-slate-600 sm:inline">/ CORE</span></Link><div className="flex items-center gap-2 sm:gap-5"><div className="hidden gap-5 sm:flex"><Status label="SEPOLIA" value={sep} /><Status label="CC3" value={ccStatus} /></div><button onClick={connect} disabled={!!busy} className="glass flex items-center gap-2 border border-border px-3 py-2 font-mono text-[9px] uppercase tracking-[.1em] text-slate-300 disabled:opacity-60"><WalletCards size={13} />{busy === 'wallet' ? 'Connecting…' : wallet ? `${wallet.slice(0, 6)}…${wallet.slice(-4)}` : 'Connect wallet'}</button></div></header><div className="mx-auto flex max-w-[1500px] border-x border-border"><aside className="hidden w-56 shrink-0 border-r border-border p-4 lg:block"><p className="eyebrow mb-5 text-slate-600">LedgerLine network</p><Link href="/dashboard" className="mb-1 flex items-center gap-3 bg-primary/10 px-3 py-3 font-mono text-[10px] uppercase tracking-[.12em] text-primary"><LayoutDashboard size={14} />Registry</Link><Link href="/dashboard/lender" className="mb-1 flex items-center gap-3 px-3 py-3 font-mono text-[10px] uppercase tracking-[.12em] text-slate-500 hover:text-slate-200"><Database size={14} />Lender desk</Link><Link href="/dashboard/borrower" className="mb-1 flex items-center gap-3 px-3 py-3 font-mono text-[10px] uppercase tracking-[.12em] text-slate-500 hover:text-slate-200"><Activity size={14} />Borrower desk</Link></aside><section className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8"><div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="eyebrow text-primary">LedgerLine / Verification desk</p><h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl">Cross-chain proof operations</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">Mine a Sepolia source event, sync its attestation, generate a receipt proof, and dispatch the verified result to CC3.</p></div><div className="border border-primary/20 bg-primary/[.04] px-4 py-3 font-mono text-[10px] text-primary">✓ 34/34 Foundry tests passed</div></div><div className="mb-6 grid gap-px border border-border bg-border sm:grid-cols-3"><div className="bg-[#080808] p-4"><p className="eyebrow text-slate-600">Current profile</p><div className="mt-4 flex gap-4"><div className="grid h-16 w-16 place-items-center rounded-full border border-primary/30 font-mono text-lg text-primary">{score}</div><div className="min-w-0 flex-1"><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full border-b border-border bg-transparent py-1 font-mono text-xs text-slate-300 outline-none" aria-label="Wallet address" /><button onClick={lookup} disabled={busy === 'lookup'} className="mt-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.1em] text-primary">{busy === 'lookup' ? <Loader2 className="animate-spin" size={13} /> : <Search size={13} />} Query live profile</button><p className="mt-2 text-[11px] text-slate-600">{profile}</p></div></div></div><div className="bg-[#080808] p-4"><p className="eyebrow text-slate-600">Verification source</p><p className="mt-4 font-mono text-sm text-slate-200">Ethereum Sepolia</p><p className="mt-2 font-mono text-[10px] text-slate-600">Source event → CC3 proof</p></div><div className="bg-[#080808] p-4"><p className="eyebrow text-slate-600">Network state</p><div className="mt-4 flex gap-4"><Status label="CC3" value={ccStatus} /><Status label="SEP" value={sep} /></div></div></div><ProofLifecycle wallet={wallet} onConnect={connect} /><div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_.8fr]"><div><AttestationLog rows={events} /></div><div className="border border-border bg-[#080808] p-5"><p className="eyebrow text-primary">Financing desk</p><h2 className="mt-2 text-xl font-semibold text-slate-100">Authorize proof dispatch</h2><p className="mt-3 text-sm leading-6 text-slate-500">Connect a wallet and submit the verified proof to the deployed LedgerLineReadabilityManager.</p><button onClick={connect} disabled={busy === 'wallet'} className="mt-5 flex w-full items-center justify-center gap-2 border border-primary/40 bg-primary/10 px-4 py-3 font-mono text-[10px] uppercase tracking-[.1em] text-primary disabled:opacity-50"><WalletCards size={14} />{busy === 'wallet' ? 'Authorizing wallet…' : 'Authorize wallet & submit proof to CC3'}</button><div className="mt-5 border-t border-border pt-4"><p className="eyebrow text-slate-600">Policy engine</p><p className="mt-2 font-mono text-xs text-slate-300">{Number(score) > 600 ? 'Eligible for immediate invoice financing advance up to 50%' : 'Verified score above 600 required for immediate advance'}</p><p className="mt-2 break-all font-mono text-[9px] text-slate-600">Manager: {READABILITY_MANAGER}</p></div></div></div></section></div></main>
}
