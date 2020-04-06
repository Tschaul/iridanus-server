import * as Color from 'color'

export const screenPseudoTransparentRaw = Color('rgba(128, 151, 158, 0.29)') as Color;
export const screenPseudoTransparent = screenPseudoTransparentRaw.toString();

export const screenWhiteRaw =  Color('rgba(230, 230, 230, 1)') as Color;
export const screenWhite = screenWhiteRaw.toString();

export const selectedYellowRaw = Color('#f6d995') as Color;
export const selectedYellow = selectedYellowRaw.toString();

export const hoverYellowRaw = Color('#f4e0b0') as Color;
export const hoverYellow = hoverYellowRaw.toString();

export const errorRedRaw =  Color("rgb(239, 105, 105)") as Color & string;
export const errorRed = errorRedRaw.toString();

export const overlayBackgroundRaw =  Color('rgba(10, 42, 51, 0.91)') as Color;
export const overlayBackground = overlayBackgroundRaw.toString();
