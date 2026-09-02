export type Invoice = { id: string; issuer: string; buyer: string; amount: number; currency: string; due: string; status: 'Verified' | 'Pending' | 'Financed'; risk: 'Low' | 'Medium' | 'High'; dataState: 'DEMO / TESTNET DATA' }

export type TimelineEvent = { label: string; meta: string; tone: 'green' | 'slate' | 'amber' }

export const demoInvoices: Invoice[] = [
  { id: 'INV-2048', issuer: 'Northstar Logistics', buyer: 'Arcadia Systems', amount: 184200, currency: 'USDC', due: '2026-10-14', status: 'Verified', risk: 'Low', dataState: 'DEMO / TESTNET DATA' },
  { id: 'INV-2047', issuer: 'Morrow Industrial', buyer: 'Northstar Logistics', amount: 92750, currency: 'USDC', due: '2026-09-28', status: 'Financed', risk: 'Low', dataState: 'DEMO / TESTNET DATA' },
  { id: 'INV-2046', issuer: 'Arcadia Systems', buyer: 'Morrow Industrial', amount: 48600, currency: 'USDC', due: '2026-09-06', status: 'Pending', risk: 'Medium', dataState: 'DEMO / TESTNET DATA' },
]

export const overviewMetricsAreDemo = true

export const overviewTimeline: TimelineEvent[] = [
  { label: 'Demo invoice record loaded', meta: 'Illustrative interface data', tone: 'slate' },
  { label: 'Credit profile query available', meta: 'Reads LedgerLineRegistry on CC3', tone: 'green' },
  { label: 'Financing policy available', meta: 'Execution not configured in frontend', tone: 'slate' },
]

export const formatUSDC = (amount: number) => `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(amount)} USDC`
