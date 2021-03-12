function isInViewport(boundingRect) {
  const {top, left, bottom, right} = boundingRect
  return (
    top >= 0 &&
    left >= 0 &&
    bottom <= window.innerHeight &&
    right <= window.innerWidth
  )
}

// const boundingRectsForScreenshots: JSHandle<DOMRect[]> = await page.evaluateHandle((selector) => {
//   const boundingRectsInViewport = Array.from(
//     document.querySelectorAll(selector)
//   ).reduce((boxes, elem) => {
//     const rect = elem.getBoundingClientRect()
//     const {top, left, bottom, right, width, height} = rect
//     const isInViewport = (
//       width > 0 &&
//       height > 0 &&
//       top >= 0 &&
//       left >= 0 &&
//       bottom <= window.innerHeight &&
//       right <= window.innerWidth
//     )
//     return isInViewport ? boxes.concat(rect) : boxes
//   }, [] as DOMRect[])

//   return JSON.stringify(boundingRectsInViewport)
// }, scriptArgs.selector)
// const boundingBoxesJSON = (await boundingRectsForScreenshots.jsonValue()) as string
// const boundingBoxes: DOMRect[] = JSON.parse(boundingBoxesJSON)

// await Promise.all(boundingBoxes.map((boundingRect, index) => {
//   console.log(index, boundingRect)
//   return screenshotBoundingRect({page, boundingRect, path: `screen_${index}.png`, padding: 20})
// }))