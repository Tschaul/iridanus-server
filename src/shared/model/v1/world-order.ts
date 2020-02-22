export type WorldOrder =
  BuildShipsOrder
  | BuildIndustryOrder;

export interface BuildShipsOrder {
  type: 'BUILD_SHIPS'
  /**
   * @minimum 1
   * @type integer
   */
  amount: number;
}

export interface BuildIndustryOrder {
  type: 'BUILD_INDUSTRY'
  /**
   * @minimum 1
   * @type integer
   */
  amount: number;
}