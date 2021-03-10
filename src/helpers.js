function isInViewport(boundingRect) {
  const {top, left, bottom, right} = boundingRect
  return (
    top >= 0 &&
    left >= 0 &&
    bottom <= window.innerHeight &&
    right <= window.innerWidth
  )
}

function screenshotBoundingRect({
  page,
  boundingRect,
  padding = 0,
}) {
  const {x, y, width, height} = boundingRect

  return await page.screenshot({
    path,
    clip: {
      x: x - padding,
      y: y - padding,
      width: width + padding * 2,
      height: height + padding * 2
    }
  });
}
