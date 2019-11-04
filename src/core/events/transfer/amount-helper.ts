export function getTrueTransferAmount(subjectAmount: number, objectAmount: number, transferAmount: number): number {
  if (transferAmount === 0) {
    return transferAmount
  } else if (transferAmount > 0) {
    if (objectAmount - transferAmount < 0) {
      return objectAmount;
    } else if (subjectAmount + transferAmount > 125) {
      return transferAmount - ((subjectAmount + transferAmount) % 125)
    } else {
      return transferAmount;
    }
  } else {
    return -1 * getTrueTransferAmount(objectAmount, subjectAmount, -1 * transferAmount);
  }
}