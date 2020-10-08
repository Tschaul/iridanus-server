export type Distribution = {
  [k: string]: number;
};

export function pickFromDistribution(dist: Distribution, random: number): string {
  const sum = total(dist);

  let pick = sum * random;

  for (const playerId of Object.getOwnPropertyNames(dist)) {
    pick -= dist[playerId]
    if (pick < 0) {
      return playerId;
    }
  }

  throw new Error("Cannot pick from empty distribution");
}

export function total(dist: Distribution) {
  return Object.values(dist).reduce((pv, cv) => pv + cv, 0)
}