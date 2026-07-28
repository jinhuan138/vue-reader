/**
 * Thanks to Xyfir
 * https://github.com/Xyfir/xyfir-reader
 */

/**
 * Listen for swipes convert them to actions.
 * @param {Document} document - The document to add event listeners to.
 * @param {function} fn - The listener function.
 * @returns {function} cleanup - Call to remove the event listeners.
 */
type epubEvent = TouchEvent & { ignore?: boolean }
type Direction = 'next' | 'prev' | 'up' | 'down'

export default function swipListener(
  document: Document,
  fn: (dire: Direction) => void
): () => void {
  // Defaults: 100, 350, 100
  // Required min distance traveled to be considered swipe
  const threshold = 50
  // Maximum time allowed to travel that distance
  const allowedTime = 500
  // Maximum distance allowed at the same time in perpendicular direction
  const restraint = 200

  let startX: number
  let startY: number
  let startTime: number
  let startTarget: EventTarget | null

  const touchStartHandler = (e: epubEvent) => {
    if (e.ignore) return
    e.ignore = true

    startX = e.changedTouches[0].clientX
    startY = e.changedTouches[0].clientY
    startTime = Date.now()
    startTarget = e.target
  }

  const touchEndHandler = (e: epubEvent) => {
    if (e.ignore) return
    e.ignore = true

    // Get distance traveled by finger while in contact with surface
    const distX = e.changedTouches[0].clientX - startX
    const distY = e.changedTouches[0].clientY - startY

    // Time elapsed since touchstart
    const elapsedTime = Date.now() - startTime

    if (elapsedTime <= allowedTime) {
      // Horizontal swipe
      if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint)
        // If dist traveled is negative, it indicates right swipe
        fn(distX < 0 ? 'next' : 'prev')
      // Vertical swipe
      else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint)
        // If dist traveled is negative, it indicates up swipe
        fn(distY < 0 ? 'up' : 'down')
      // Tap
      else {
        document?.defaultView?.getSelection()?.removeAllRanges()

        // Convert tap to click
        const target =
          document.elementFromPoint(startX, startY) || startTarget || document

        const MouseEventConstructor =
          document.defaultView?.MouseEvent || MouseEvent

        target.dispatchEvent(
          new MouseEventConstructor('click', {
            bubbles: true,
            cancelable: true,
            clientX: startX,
            clientY: startY,
            view: document.defaultView,
          })
        )

        // !! Needed to prevent double 'clicks' in certain environments
        if (e.cancelable) e.preventDefault()
      }
    }
  }

  document.addEventListener('touchstart', touchStartHandler as EventListener, false)
  document.addEventListener('touchend', touchEndHandler as EventListener, false)

  return () => {
    document.removeEventListener('touchstart', touchStartHandler as EventListener, false)
    document.removeEventListener('touchend', touchEndHandler as EventListener, false)
  }
}

