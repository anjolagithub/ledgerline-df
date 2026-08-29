import { ethers } from 'ethers'
import { ADDRESSES, MANAGER_ABI, REGISTRY_ABI, RPC, SETTLEMENT_ABI, SOURCE_REGISTRY_ABI } from './contracts'

export type CreditProfile = { score: number; totalVerifiedRepayments: string; completedLoanCount: number; lastUpdated: number }
export type LogRow = { chain: 'sepolia' | 'cc3'; event: string; hash: string }

export async function getCreditProfile(address: string): Promise<CreditProfile> {
  if (!ethers.isAddress(address)) throw new Error('Invalid wallet address')
  const provider = new ethers.JsonRpcProvider(RPC.cc3)
  const registry = new ethers.Contract(ADDRESSES.registry, REGISTRY_ABI, provider)
  const profile = await registry.getCreditProfile(address)
  return { score: Number(profile.score), totalVerifiedRepayments: ethers.formatUnits(profile.totalVerifiedRepayments, 18), completedLoanCount: Number(profile.completedLoanCount), lastUpdated: Number(profile.lastUpdated) }
}

export async function getAttestationLog(): Promise<LogRow[]> {
  const sepolia = new ethers.JsonRpcProvider(RPC.sepolia)
  const cc3 = new ethers.JsonRpcProvider(RPC.cc3)
  const source = new ethers.Contract(ADDRESSES.sourceRegistry, SOURCE_REGISTRY_ABI, sepolia)
  const settlement = new ethers.Contract(ADDRESSES.sourceSettlement, SETTLEMENT_ABI, sepolia)
  const manager = new ethers.Contract(ADDRESSES.manager, MANAGER_ABI, cc3)
  const [registered, funded, repaid, verified] = await Promise.all([
    source.queryFilter(source.filters.LoanRegistered(), -50000).catch(() => []),
    settlement.queryFilter(settlement.filters.LoanFunded(), -50000).catch(() => []),
    settlement.queryFilter(settlement.filters.LoanRepaid(), -50000).catch(() => []),
    manager.queryFilter(manager.filters.QueryProcessed(), -5000).catch(() => []),
  ])
  return [
    ...registered.map((e: any) => ({ chain: 'sepolia' as const, event: 'LoanRegistered', hash: e.transactionHash })),
    ...funded.map((e: any) => ({ chain: 'sepolia' as const, event: 'LoanFunded', hash: e.transactionHash })),
    ...repaid.map((e: any) => ({ chain: 'sepolia' as const, event: 'LoanRepaid', hash: e.transactionHash })),
    ...verified.map((e: any) => ({ chain: 'cc3' as const, event: 'QueryProcessed (Attested)', hash: e.transactionHash })),
  ]
}

export async function checkNetworkStatus() {
  const results = { cc3: false, sepolia: false }
  try { await new ethers.JsonRpcProvider(RPC.cc3).getBlockNumber(); results.cc3 = true } catch {}
  try { await new ethers.JsonRpcProvider(RPC.sepolia).getBlockNumber(); results.sepolia = true } catch {}
  return results
}
