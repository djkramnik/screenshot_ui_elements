import { JSHandle } from 'puppeteer';
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

  const elemCount = await page.evaluate((selector) => {
    return document.querySelectorAll(selector).length
  }, scriptArgs.selector)

  for(let i = 0; i < elemCount; i++) {
    const elemHandle: JSHandle<HTMLElement> = await page.evaluateHandle((index, selector) => {
      return document.querySelectorAll(selector)[index]
    }, i, scriptArgs.selector)
    const elem = elemHandle.asElement()
    if (elem === null) {
      continue
    }
    await elem.hover()
    if (!elem.isIntersectingViewport()) {
      continue
    }
    await elem.screenshot({path: `screen_${i}.png`})
  }
})()