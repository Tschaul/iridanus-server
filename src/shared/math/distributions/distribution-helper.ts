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

export function majorityHolder(distribution: Distribution) {
  let max = 0;
  let majorityHolder: string | null = null;
  for (const playerId of Object.getOwnPropertyNames(distribution)) {
    if (distribution[playerId] >= max) {
      max = distribution[playerId];
      majorityHolder = playerId;
    }
  }
  return majorityHolder
}

export function absoluteMajorityHolder(distribution: Distribution) {
  let sum = total(distribution);
  const maj = majorityHolder(distribution)
  if (!maj || !sum) {
    return null;
  }

  const max = distribution[maj];

  if (max > Math.ceil(sum / 2)) {
    return maj;
  } else {
    return null;
  }

}