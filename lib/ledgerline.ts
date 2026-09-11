import { ethers } from 'ethers'
import { ADDRESSES, MANAGER_ABI, REGISTRY_ABI, RPC, SETTLEMENT_ABI, SOURCE_REGISTRY_ABI } from './contracts'

export type CreditProfile = { score: number; totalVerifiedRepayments: string; completedLoanCount: number; lastUpdated: number }
export type LogRow = { chain: 'sepolia' | 'cc3'; event: string; hash: string; blockNumber?: number; timestamp?: number }

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
  const rows = [...registered.map((e: any) => ({ chain: 'sepolia' as const, event: 'LoanRegistered', hash: e.transactionHash, blockNumber: e.blockNumber })), ...funded.map((e: any) => ({ chain: 'sepolia' as const, event: 'LoanFunded', hash: e.transactionHash, blockNumber: e.blockNumber })), ...repaid.map((e: any) => ({ chain: 'sepolia' as const, event: 'LoanRepaid', hash: e.transactionHash, blockNumber: e.blockNumber })), ...verified.map((e: any) => ({ chain: 'cc3' as const, event: 'QueryProcessed (Attested)', hash: e.transactionHash, blockNumber: e.blockNumber }))]
  return Promise.all(rows.map(async (row) => { try { const provider = row.chain === 'cc3' ? cc3 : sepolia; const block = await provider.getBlock(row.blockNumber); return { ...row, timestamp: block?.timestamp } } catch { return row } }))
}

export type ProofApiPayload = { headerNumber: string | number; txBytes: string; merkleProof: string[]; continuityProof: string[] }

export const PROOF_API = 'https://proof-gen-api.cc3-testnet.creditcoin.network/api/v1'

export async function getSepoliaTransaction(txHash: string) {
  const provider = new ethers.JsonRpcProvider(RPC.sepolia)
  const receipt = await provider.getTransactionReceipt(txHash)
  if (!receipt) throw new Error('Source transaction is not mined yet.')
  return { blockNumber: receipt.blockNumber, status: receipt.status, logs: receipt.logs }
}

async function proofApi<T>(path: string): Promise<T> {
  const response = await fetch(`${PROOF_API}${path}`, { cache: 'no-store' })
  if (!response.ok) throw new Error(`Proof service returned HTTP ${response.status}.`)
  return response.json() as Promise<T>
}

export async function getAttestedHeight() {
  const payload = await proofApi<{ height?: string | number; attestedHeight?: string | number }>('/attested-height/1')
  const height = payload.height ?? payload.attestedHeight
  if (height === undefined) throw new Error('Proof service returned no attested height.')
  return Number(height)
}

export async function getProofByTransaction(txHash: string) {
  return proofApi<ProofApiPayload>(`/proof-by-tx/1/${encodeURIComponent(txHash)}`)
}

export async function waitForAttestation(blockNumber: number, onProgress?: (height: number) => void, timeoutMs = 120_000) {
  const started = Date.now()
  while (Date.now() - started < timeoutMs) {
    const height = await getAttestedHeight()
    onProgress?.(height)
    if (height >= blockNumber) return height
    await new Promise((resolve) => setTimeout(resolve, 5_000))
  }
  throw new Error(`Attestation has not reached source block ${blockNumber.toLocaleString()} within the waiting window.`)
}

export async function submitReadabilityProof(signer: ethers.Signer, action: number, proof: ProofApiPayload) {
  const manager = new ethers.Contract(ADDRESSES.manager, MANAGER_ABI, signer)
  const transaction = await manager.submitProof(action, proof.headerNumber, proof.txBytes, proof.merkleProof, proof.continuityProof)
  const receipt = await transaction.wait()
  return { hash: transaction.hash, status: receipt?.status ?? 0, blockNumber: receipt?.blockNumber ?? null }
}

export async function checkNetworkStatus() {
  const results = { cc3: false, sepolia: false }
  try { await new ethers.JsonRpcProvider(RPC.cc3).getBlockNumber(); results.cc3 = true } catch {}
  try { await new ethers.JsonRpcProvider(RPC.sepolia).getBlockNumber(); results.sepolia = true } catch {}
  return results
}
