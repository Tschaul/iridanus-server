export function animateElement(element: HTMLElement | null, animation: string) {
  return new Promise((resolve) => {
    if (element) {
      element.classList.add(animation)
      console.log(animation)
      const removeAnimationClass = () => {
        element.classList.remove(animation)
        element.removeEventListener('animationend', removeAnimationClass);
        resolve();
      }
      element.addEventListener('animationend', removeAnimationClass)
    }
    resolve();
  })
}