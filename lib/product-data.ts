export type Invoice = { id: string; issuer: string; buyer: string; amount: number; currency: string; due: string; status: 'Verified' | 'Pending' | 'Financed'; risk: 'Low' | 'Medium' | 'High' }

export type TimelineEvent = { label: string; meta: string; tone: 'green' | 'slate' | 'amber' }

export const demoInvoices: Invoice[] = [
  { id: 'INV-2048', issuer: 'Northstar Logistics', buyer: 'Arcadia Systems', amount: 184200, currency: 'USDC', due: '2026-10-14', status: 'Verified', risk: 'Low' },
  { id: 'INV-2047', issuer: 'Morrow Industrial', buyer: 'Northstar Logistics', amount: 92750, currency: 'USDC', due: '2026-09-28', status: 'Financed', risk: 'Low' },
  { id: 'INV-2046', issuer: 'Arcadia Systems', buyer: 'Morrow Industrial', amount: 48600, currency: 'USDC', due: '2026-09-06', status: 'Pending', risk: 'Medium' },
]

export const overviewTimeline: TimelineEvent[] = [
  { label: 'Invoice INV-2048 verified', meta: 'Sepolia receipt decoded · 12s ago', tone: 'green' },
  { label: 'Credit profile refreshed', meta: 'Score 742 · 3m ago', tone: 'green' },
  { label: 'Financing quote prepared', meta: '18.4k USDC eligible · 8m ago', tone: 'slate' },
]

export const formatUSDC = (amount: number) => `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(amount)} USDC`
