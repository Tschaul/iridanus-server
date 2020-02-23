import jss, { Styles } from 'jss'
import preset from 'jss-preset-default'
// import nested from 'jss-plugin-camel-case'

jss.setup(preset())

export function createClasses(styles: Partial<Styles<string>>) {
  return jss.createStyleSheet(styles).attach().classes;
}