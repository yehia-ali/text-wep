export interface Transaction {
  amount: number,
  creationDate: string,
  transactionType: number,
  transactionId: number,
  currentBalance: number,
  paymentType: number,
  transactionNote: string,
  walletFromId: number,
  walletFromName: string,
  walletFromPic: string,
  walletToId: number,
  walletToName: string,
  walletToPic: string,
  expand: boolean
}
