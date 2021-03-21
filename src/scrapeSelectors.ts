import { PUPPETEER_LAUNCH_OPTIONS, SiteSelector } from './config';
import { getDomainFromUrl, prepareOutputDir } from './outputDir';
import { getPageRef, screenShotElementsRecursively } from './util'
import * as playlist from './playlist.json'

const domainsAndSelectors: SiteSelector[] = playlist.selectors.reduce((result: SiteSelector[], selector: string) => {
  return result.concat(
    playlist.urls.map(url => ({
      url,
      selector,
    }))
  )
}, [] as SiteSelector[])

export const scrapeSelectors = async (mapUrlToDomain?: Function, getKey?: Function) => {
  const {page, browser} = await getPageRef(PUPPETEER_LAUNCH_OPTIONS)

  for(let i = 0; i < domainsAndSelectors.length; i++) {
    const {url, selector} = domainsAndSelectors[i]
    // parse out the domain name and if its not a directory in screenshots then create it there
    const domain = (mapUrlToDomain ?? getDomainFromUrl)(url)
    const siteSelectorKey = getKey ? getKey(domain, selector) : `${domain}_${selector}`
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
}
