export const ADDRESSES = {
  registry: '0xde8365dAF3CFdF952E2F946F19a4DcAcd57eFf0F',
  manager: '0xCC0B4686de40Ff5ae1e0B8d58Da9175e9090610D',
  sourceRegistry: '0x1Af3D4ED1D2592DdAD9c13A3004006c9785eC6fF',
  sourceSettlement: '0xa00DeE06b5d8DD4889683d2d526a744C2Bd67297',
} as const

export const RPC = {
  cc3: 'https://rpc.cc3-testnet.creditcoin.network',
  sepolia: 'https://ethereum-sepolia-rpc.publicnode.com',
} as const

export const CHAIN_IDS = { sepolia: 11155111, cc3: 102031 } as const
export const EXAMPLE_ADDRESS = '0x00dC0f3ff1F2bca6b3d007684cC25a766c9815f4'

export const REGISTRY_ABI = ['function getCreditProfile(address) view returns (tuple(uint16 score, uint256 totalVerifiedRepayments, uint256 completedLoanCount, uint256 lastUpdated))']
export const SOURCE_REGISTRY_ABI = ['event LoanRegistered(uint256 indexed loanId, address indexed lender, address indexed borrower, uint256 loanAmount, uint256 expectedRepaymentAmount, uint256 deadlineTimestamp)']
export const SETTLEMENT_ABI = ['event LoanFunded(uint256 indexed loanId, address indexed lender, address indexed borrower, uint256 amount)', 'event LoanRepaid(uint256 indexed loanId, uint256 amount)']
export const MANAGER_ABI = ['event QueryProcessed(bytes32 indexed queryId, uint8 action)']
