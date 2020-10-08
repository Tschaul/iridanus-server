export type WorldType =
  RegularWorldType
  | VoidWorldType
  | NebulaWorldType
  | LushWorldType
  | DefensiveWorldType
  | InspiringWorldType
  | IndustrialWorldType
  | MiningWorldType
  | PopulatedWorldType
  | CreepWorldType
  | DoubleWorldType

export type RegularWorldType = {
  type: 'REGULAR'
}

export type DoubleWorldType = {
  type: 'DOUBLE'
}

export type VoidWorldType = {
  type: 'VOID'
}

export type NebulaWorldType = {
  type: 'NEBULA'
}

export type LushWorldType = {
  type: 'LUSH'
}

export type DefensiveWorldType = {
  type: 'DEFENSIVE'
}

export type PopulatedWorldType = {
  type: 'POPULATED'
}

export type CreepWorldType = {
  type: 'CREEP'
}

export type InspiringWorldType = {
  type: 'INSPIRING'
}

export type IndustrialWorldType = {
  type: 'INDUSTRIAL'
}

export type MiningWorldType = {
  type: 'MINING'
}