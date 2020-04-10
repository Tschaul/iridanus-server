

export interface RemeberedWorld {
  id: string
  status: 'REMEMBERED',
  ownerId?: string,
  industry: number,
  mines: number,
  population: number,
  populationLimit: number,
  rememberedTimestamp: number,
}

export type WorldVisibilityStatus = RemeberedWorld | { id: string; status: 'VISIBLE' }