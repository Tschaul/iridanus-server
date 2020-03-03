export function getTrueTransferAmount(subjectAmount: number, objectAmount: number, transferAmount: number, maxAmount: number): number {
  if (objectAmount < transferAmount) {
    return objectAmount;
  } else if (subjectAmount + transferAmount > maxAmount) {
    return transferAmount - ((subjectAmount + transferAmount) % maxAmount)
  } else {
    return transferAmount;
  }
}