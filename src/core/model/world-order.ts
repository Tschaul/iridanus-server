export type WorldOrder =
  BuildShipOrder
  | BuildIndustryOrder;

export interface BuildShipOrder {
  type: 'BUILD_SHIP'
}

export interface BuildIndustryOrder {
  type: 'BUILD_INDUSTRY'
}