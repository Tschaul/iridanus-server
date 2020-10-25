import React from "react";
import { HomeIcon } from "./raw/home-icon";
import { IconComponent } from "./raw/icon-component-base";
import { IndustryIcon } from "./raw/industry-icon";
import { MetalIcon } from "./raw/metal-icon";
import { PopulationIcon } from "./raw/population-icon";
import { ShieldIcon } from "./raw/shield-icon";
import { ShipsIcon } from "./raw/ships-icon";

export type IconType = 'population' | 'metal' | 'industry' | 'ships' | 'shield' | 'home';

export class IconSvg extends React.Component<{
  x: number,
  y: number,
  size: number,
  color: string,
  type: IconType
}> {

  render() {

    const posX = this.props.x - 0.5 * this.props.size;
    const posY = this.props.y - 0.5 * this.props.size;

    const IconComponentForType = this.getComponent();
    return <IconComponentForType
      posX={posX}
      posY={posY}
      size={this.props.size}
      color={this.props.color}
    ></IconComponentForType>
  }

  getComponent(): IconComponent {
    switch (this.props.type) {
      case 'population': return PopulationIcon
      case 'metal': return MetalIcon
      case 'industry': return IndustryIcon
      case 'ships': return ShipsIcon
      case 'shield': return ShieldIcon
      case 'home': return HomeIcon
    }
  }
}