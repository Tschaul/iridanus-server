export function assertNever(val: never): never {
  throw Error('Should never happen')
}