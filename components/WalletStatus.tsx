'use client'

import { Check, CircleAlert, Copy, LoaderCircle, Wallet } from 'lucide-react'
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'
import { creditcoinTestnet } from '../lib/wagmi'
import { useState } from 'react'

function shorten(value: string) { return `${value.slice(0, 6)}…${value.slice(-4)}` }

export function WalletStatus() {
  const { address, chainId, isConnected, isConnecting } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const [copied, setCopied] = useState(false)
  const wrongNetwork = isConnected && chainId !== creditcoinTestnet.id
  const busy = isConnecting || isPending || isSwitching
  const copyAddress = async () => { if (!address) return; await navigator.clipboard.writeText(address); setCopied(true); window.setTimeout(() => setCopied(false), 1500) }

  if (!isConnected) return <button type="button" onClick={() => connect({ connector: connectors[0] })} disabled={busy} className="inline-flex items-center gap-2 border border-emerald-400/40 bg-emerald-400/10 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-emerald-300 transition hover:bg-emerald-400/20 disabled:cursor-wait disabled:opacity-60"><Wallet className="size-3.5" />{busy ? 'Connecting…' : 'Connect wallet'}</button>

  return <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em]">
    {wrongNetwork ? <button type="button" onClick={() => switchChain({ chainId: creditcoinTestnet.id })} disabled={busy} className="inline-flex items-center gap-2 border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-amber-300 disabled:opacity-60"><CircleAlert className="size-3.5" />{busy ? 'Switching…' : 'Switch to CC3'}</button> : <span className="inline-flex items-center gap-2 border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-emerald-300"><Check className="size-3.5" />CC3 online</span>}
    <button type="button" onClick={copyAddress} title="Copy wallet address" className="border border-white/10 px-3 py-2 text-slate-300 hover:border-white/25">{copied ? 'Copied' : shorten(address ?? '')}</button>
    <button type="button" onClick={() => disconnect()} className="border border-white/10 px-2 py-2 text-slate-500 hover:text-slate-200" aria-label="Disconnect wallet">Disconnect</button>
  </div>
}
