export type WorldOrder =
  BuildShipsOrder
  | BuildIndustryOrder
  | ScrapShipsForIndustryOrder;

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

export interface ScrapShipsForIndustryOrder {
  type: 'SCRAP_SHIPS_FOR_INDUSTRY',
  /**
   * @minimum 1
   * @maximum 99
   * @type integer
   */
  amount: number;
}