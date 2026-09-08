'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, Loader2, Network } from 'lucide-react'
import { Contract, parseUnits } from 'ethers'
import { useWalletContext } from '../../../lib/WalletContext'
import { ADDRESSES, CHAIN_IDS, DEMO_TOKEN, SOURCE_REGISTRY_ABI } from '../../../lib/contracts'
import { TransactionReceipt } from '../../../components/TransactionReceipt'

export default function LenderPage() {
  const { address, signer, chainId, connect } = useWalletContext()
  const [borrower, setBorrower] = useState('')
  const [amount, setAmount] = useState('100')
  const [expected, setExpected] = useState('110')
  const [days, setDays] = useState('30')
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)
  const [txHash, setTxHash] = useState('')
  const [txError, setTxError] = useState('')

  async function register() {
    setTxHash(''); setTxError('')
    if (!signer) return setStatus('Connect wallet first.')
    if (chainId !== CHAIN_IDS.sepolia) return setStatus('Switch wallet to Sepolia.')
    if (!/^0x[a-fA-F0-9]{40}$/.test(borrower)) return setStatus('Enter a valid borrower address.')
    if (Number(amount) <= 0 || Number(expected) <= 0 || Number(days) <= 0) return setStatus('Enter positive loan values.')
    setBusy(true); setStatus('Preparing transaction…')
    try {
      const contract = new Contract(ADDRESSES.sourceRegistry, SOURCE_REGISTRY_ABI, signer)
      setStatus('Confirm loan registration in wallet…')
      const tx = await contract.registerLoan(borrower, DEMO_TOKEN, parseUnits(amount, 18), parseUnits(expected, 18), Math.floor(Date.now() / 1000) + Number(days) * 86400)
      setTxHash(tx.hash); setStatus('Transaction submitted. Waiting for Sepolia receipt…')
      await tx.wait(); setStatus('Loan registration confirmed on Sepolia.')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Transaction failed.'
      setTxError(message); setStatus(message.includes('user rejected') ? 'Wallet signature rejected.' : 'Loan registration failed.')
    } finally { setBusy(false) }
  }

  return <main className="min-h-screen overflow-x-hidden bg-background text-foreground"><header className="flex min-h-16 items-center justify-between border-b border-border px-5 lg:px-8"><Link href="/dashboard" className="flex items-center gap-3 text-xs font-semibold tracking-[.22em] text-slate-100"><span className="grid h-7 w-7 place-items-center bg-primary text-primary-foreground"><Network size={14}/></span>LEDGERLINE <span className="text-slate-600">/ LENDER</span></Link><Link href="/dashboard" className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.14em] text-slate-500 hover:text-primary"><ArrowLeft size={13}/> Core registry</Link></header><div className="mx-auto max-w-5xl px-5 py-10 lg:px-8"><p className="eyebrow text-primary">LedgerLine network / lender desk</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.05em] text-slate-100">Register a loan</h1><p className="mt-2 font-mono text-[10px] uppercase tracking-[.12em] text-slate-600">Commit a verifiable credit record on Sepolia.</p><section className="mt-8 border border-border bg-[#060606] p-5 sm:p-7"><div className="grid gap-3"><input value={borrower} onChange={e=>setBorrower(e.target.value)} placeholder="Borrower wallet address" className="border border-border bg-background px-3 py-3 font-mono text-xs text-slate-200 outline-none focus:border-primary"/><div className="grid gap-3 sm:grid-cols-3"><input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Loan amount" className="border border-border bg-background px-3 py-3 font-mono text-xs"/><input value={expected} onChange={e=>setExpected(e.target.value)} placeholder="Expected repayment" className="border border-border bg-background px-3 py-3 font-mono text-xs"/><input value={days} onChange={e=>setDays(e.target.value)} placeholder="Deadline days" className="border border-border bg-background px-3 py-3 font-mono text-xs"/></div><button onClick={async()=>{if(address)return register();setStatus('Connecting wallet…');try{await connect();setStatus('Wallet connected. Submit the loan form.')}catch(error){setStatus(error instanceof Error?error.message:'Wallet connection failed.')}}} disabled={busy} className="flex items-center justify-center gap-2 bg-primary px-4 py-3 font-mono text-[10px] uppercase tracking-[.12em] text-primary-foreground disabled:opacity-50">{busy&&<Loader2 size={13} className="animate-spin"/>}{address?'Register loan':'Connect wallet'}</button></div>{status&&<p className="mt-4 font-mono text-[10px] text-slate-400" aria-live="polite">{status}</p>}{txHash&&<div className="mt-4"><TransactionReceipt hash={txHash} chain="sepolia" status={busy?'submitted':'confirmed'} label="Loan registration" error={txError}/></div>}{txError&&!txHash&&<div className="mt-4"><TransactionReceipt chain="sepolia" status="failed" label="Loan registration" error={txError}/></div>}</section></div></main>
}
