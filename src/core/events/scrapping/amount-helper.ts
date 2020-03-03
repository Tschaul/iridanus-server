export function getTrueScrappigAmount(worldIndustry: number, fleetShips: number, buildIndustry: number, shipsPerIndustry: number, maxAmount: number): number {
  const maxIndustry = Math.floor(fleetShips * shipsPerIndustry);
  if (buildIndustry > maxIndustry) {
    return maxIndustry;
  } else if (worldIndustry + buildIndustry > maxAmount) {
    return buildIndustry - ((worldIndustry + buildIndustry) % maxAmount)
  } else {
    return buildIndustry;
  }
}