function isInViewport(boundingRect) {
  const {top, left, bottom, right} = boundingRect
  return (
    top >= 0 &&
    left >= 0 &&
    bottom <= window.innerHeight &&
    right <= window.innerWidth
  )
}
