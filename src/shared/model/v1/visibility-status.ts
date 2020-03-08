

export interface RemeberedWorld {
  id: string
  status: 'REMEBERED',
  ownerId?: string,
  industry: number,
  mines: number,
  population: number,
  populationLimit: number,
  remeberedTimestamp: number,
}

export type WorldVisibilityStatus = RemeberedWorld | { id: string; status: 'VISIBLE' }