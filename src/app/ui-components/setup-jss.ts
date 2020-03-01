import jss, { Styles } from 'jss'
import preset from 'jss-preset-default'
// import nested from 'jss-plugin-camel-case'

jss.setup(preset())

export interface StyleSheet {
  [className: string]: React.CSSProperties
}

export type ClassNames<TStyleSheet> = {
  [className in keyof TStyleSheet]: string
}

export function createClasses<TSheet extends StyleSheet>(styles: TSheet) {
  return jss.createStyleSheet(styles as any).attach().classes as ClassNames<TSheet>;
}