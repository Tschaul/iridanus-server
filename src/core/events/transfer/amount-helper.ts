export function getTrueTransferAmount(sourceAmount: number, targetAmount: number, transferAmount: number, maxAmount: number): number {
  if (sourceAmount < transferAmount) {
    transferAmount = sourceAmount;
  } 
  if (targetAmount + transferAmount > maxAmount) {
    return maxAmount - targetAmount;
  } else {
    return transferAmount;
  }
}