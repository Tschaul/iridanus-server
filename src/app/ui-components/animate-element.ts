export function animateElement(element: HTMLElement | null, animation: string) {
  return new Promise((resolve) => {
    if (element !== null) {
      element.classList.add(animation)
      const removeAnimationClass = () => {
        element.classList.remove(animation)
        element.removeEventListener('animationend', removeAnimationClass);
        resolve();
      }
      element.addEventListener('animationend', removeAnimationClass)
    } else {
      resolve();
    }
  })
}