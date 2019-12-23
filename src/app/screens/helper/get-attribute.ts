export function getClosestAttribute(event: React.MouseEvent<Element, MouseEvent>, attributeName: string) {
  const target = event.target as HTMLDivElement;
  const elem = target.hasAttribute(attributeName) ? target : target.closest('div[' + attributeName + ']') as HTMLDivElement;
  if (!elem) {
    return null;
  } else {
    return elem.getAttribute(attributeName);
  }
}
