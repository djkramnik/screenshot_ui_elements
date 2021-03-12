import * as path from 'path'
import { ElementHandle } from 'puppeteer';
import { PUPPETEER_LAUNCH_OPTIONS } from './config';
import { getPageRef, screenshotBoundingRect } from './util'

const defaultArgs = {
  url: 'https://youtube.com',
  selector: 'button',
}

const scriptArgs = {
  url: process.argv[2] ?? defaultArgs.url,
  selector: process.argv[3] ?? defaultArgs.selector,
}

;(async () => {

  const page = await getPageRef(PUPPETEER_LAUNCH_OPTIONS)

  await page.goto(scriptArgs.url, {waitUntil: 'networkidle0'})

  const elementHandles = await page.$$(scriptArgs.selector)
  const oldIndexes: Record<number, boolean> = {}
  
  async function screenShotElementsRecursively(handles: ElementHandle<Element>[], oldIndexes: Record<number, boolean>) {
    console.log('beginning', Object.keys(oldIndexes).length)
    for(let i = 0; i < handles.length; i++) {
      if (i in oldIndexes) {
        continue
      }
      const elem = elementHandles[i]
      if (await elem?.isIntersectingViewport()) {
        console.log('screenshot', i)
        await elem.hover()
        await elem.screenshot({path: path.join(__dirname, `../screenshots/screen_${i}.png`)})
      }
      oldIndexes[i] = true
    }
    // at bottom? return
    const isScrolledToBottom = await page.evaluate(() => {
      return (window.innerHeight + window.pageYOffset) - document.body.offsetHeight < 10 // close enough
    })
    if (isScrolledToBottom) {
      return
    }
    // not at bottom? scroll and recurse
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight)
    })
    screenShotElementsRecursively(handles, oldIndexes)
  }
})()