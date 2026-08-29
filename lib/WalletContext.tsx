'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { BrowserProvider, type JsonRpcSigner } from 'ethers'

type WalletState = { address: string; signer: JsonRpcSigner | null; chainId: number | null; connect: () => Promise<void> }
const WalletContext = createContext<WalletState>({ address: '', signer: null, chainId: null, connect: async () => {} })

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState(''); const [signer, setSigner] = useState<JsonRpcSigner | null>(null); const [chainId, setChainId] = useState<number | null>(null)
  const connect = async () => { const eth = (window as Window & { ethereum?: unknown }).ethereum; if (!eth) throw new Error('Install MetaMask or another injected wallet.'); const provider = new BrowserProvider(eth); const accounts = await provider.send('eth_requestAccounts', []); const next = await provider.getSigner(); const network = await provider.getNetwork(); setAddress(accounts[0] ?? ''); setSigner(next); setChainId(Number(network.chainId)) }
  useEffect(() => { const eth = (window as Window & { ethereum?: { on?: (event: string, cb: () => void) => void } }).ethereum; eth?.on?.('accountsChanged', () => void connect()); eth?.on?.('chainChanged', () => void connect()) }, [])
  return <WalletContext.Provider value={{ address, signer, chainId, connect }}>{children}</WalletContext.Provider>
}
export const useWalletContext = () => useContext(WalletContext)
