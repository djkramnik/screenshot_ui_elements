import { PUPPETEER_LAUNCH_OPTIONS } from './config';
import { getPageRef, screenshotBoundingRect } from './util'

const defaultArgs = {
  url: 'www.youtube.com',
  selector: 'button',
}

const scriptArgs = {
  url: process.argv[2] ?? defaultArgs.url,
  selector: process.argv[3] ?? defaultArgs.selector,
}

;(async () => {

  const page = await getPageRef(PUPPETEER_LAUNCH_OPTIONS)

  await page.goto(scriptArgs.url)
  const boundingRectsForScreenshots = await page.evaluate(() => {
    const boundingRectsInViewport = Array.from(
      document.querySelectorAll(scriptArgs.selector)
    ).reduce((boxes, elem) => {
      const rect = elem.getBoundingClientRect()
      const {top, left, bottom, right} = rect
      const isInViewport = (
        top >= 0 &&
        left >= 0 &&
        bottom <= window.innerHeight &&
        right <= window.innerWidth
      )
      return isInViewport ? boxes.concat(rect) : boxes
    }, [] as DOMRect[])
    return boundingRectsInViewport
  })
  await Promise.all(boundingRectsForScreenshots.map((boundingRect, index) => {
    return screenshotBoundingRect({page, boundingRect, path: `screen_${index}.png`, padding: 20})
  }))
})()