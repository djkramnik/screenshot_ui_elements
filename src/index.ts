import { PUPPETEER_LAUNCH_OPTIONS, playlist } from './config';
import { getDomainFromUrl, prepareOutputDir } from './outputDir';
import { getPageRef, screenShotElementsRecursively } from './util'

;(async () => {

  const {page, browser} = await getPageRef(PUPPETEER_LAUNCH_OPTIONS)

  for(let i = 0; i < playlist.length; i++) {
    const {url, selector} = playlist[i]
    // parse out the domain name and if its not a directory in screenshots then create it there
    const domain = getDomainFromUrl(url)
    const siteSelectorKey = `${domain}_${selector}`
    prepareOutputDir(siteSelectorKey)
    await page.goto(url, {waitUntil: 'networkidle0'})
    const elementHandles = await page.$$(selector)
    const oldIndexes: Record<number, boolean> = {}
    await screenShotElementsRecursively({
      handles: elementHandles,
      siteSelectorKey,
      page,
      oldIndexes,
    })
  }
  
  await browser.close()
  console.log('goodbye')
  process.exit(0)


})()