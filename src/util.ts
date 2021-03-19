import * as path from 'path'
import {MAX_SCROLLS} from './config'
import { LaunchOptions, Page, launch, Browser, ElementHandle } from "puppeteer"
import { getScrollRecord, incrementScrollRecord } from './scrollhistory'
import { ROOT_PATH } from './outputDir'

const padding = 10

export const getPageRef = async (options: LaunchOptions): Promise<{page: Page, browser: Browser}> => {
  const browser = await launch(options)
  const page = await browser.newPage()
  page.setDefaultNavigationTimeout(0)
  page.setViewport({width: 1400, height: 1000})
  return {page, browser}
}

export async function screenShotElementsRecursively({
  handles,
  oldIndexes,
  siteSelectorKey,
  page,
}: {
  handles: ElementHandle<Element>[]
  oldIndexes: Record<number, boolean>
  siteSelectorKey: string
  page: Page
}) {
  let scrollsPerformed = getScrollRecord(siteSelectorKey)
  if (scrollsPerformed >= MAX_SCROLLS) {
    return
  }

  for(let i = 0; i < handles.length; i++) {
    if (i in oldIndexes) {
      continue
    }
    const elem = handles[i]
    if (await elem?.isIntersectingViewport()) {
      console.log('screenshot', siteSelectorKey, i)
      try {
        const boundingBox = await elem.boundingBox()
        if (!boundingBox?.width) {
          oldIndexes[i] = true
          continue
        }
        await elem.hover()
        await new Promise(resolve => setTimeout(resolve, 500))
        const clip = {...boundingBox}
        clip.x -= padding
        clip.y -= padding
        clip.width += padding * 2
        clip.height += padding * 2
        await page.screenshot({
          path: path.join(ROOT_PATH, siteSelectorKey, `${i}.png`),
          clip,
        })
      } catch(e) {
        // swallow error
        // I cant stop this code in the try block from occasionally throwing for reasons unknown
        // if this happens we just dont get a screenshot for this element
      }

      oldIndexes[i] = true
    }
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
  scrollsPerformed = incrementScrollRecord(siteSelectorKey)
  if (scrollsPerformed >= MAX_SCROLLS) {
    return
  }
  await screenShotElementsRecursively({handles, oldIndexes, siteSelectorKey, page})
}