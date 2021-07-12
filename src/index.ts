import * as path from 'path';
import * as fs from 'fs';
import {Page} from 'puppeteer';
import { PUPPETEER_LAUNCH_OPTIONS } from './config';
import { prepareOutputDir, ROOT_PATH } from './outputDir';
import { getPageRef } from './util';
import * as playlist from './playlist.json'

type SiteSelector = {
  url: string
  selectors: string[]
}

type ClipData = {
  x: number
  y: number
  width: number
  height: number
}

type PageOffsetEntry = {
  fileName: string
  clipData: ClipData[]
}

const takeSelectorScreenshotsFactory = (page: Page) => {
  return async function takeSelectorScreenshots({
    dirName,
    selector,
    url,
  }: {
    dirName: string
    selector: string
    url: string
  }) {
    await page.goto(url, {waitUntil: 'domcontentloaded'});
    const handles = await page.$$(selector);
    // x, y, width, height
    let clipData: {[key: number]: PageOffsetEntry} = {};
    for (const handle of handles) {
      try {
        await handle.hover();
      } catch (e) {
        console.log('error on hover attempt.  completely ignoring...')
        continue
      }
      
      await sleep(1000)
      
      const rect = await page.evaluate((el) => {
        if (!isElementInViewport(el)) {
          return null
        }
  
        const {top, left, width, height} = el.getBoundingClientRect();
        if (!width || !height) {
          return null;
        }
        
        return {
          x: parseInt(left),
          y: parseInt(top),
          width: parseInt(width),
          height: parseInt(height)
        };
        
        // @ts-ignore
        function isElementInViewport (el) {
          var rect = el.getBoundingClientRect();
        
          return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
          );
        }
      }, handle)

      if (rect === null) {
        continue
      }

      // we have a clip.. 
      // name the screenshot after the pageYOffset of the window
      // see if that already exists... if it does then concat the clip data
      // otherwise create a new entry
      
      const pageYOffset = await page.evaluate(() => {
        return window.pageYOffset
      })

      if (pageYOffset in clipData) {
        // no need to take screenshot
        clipData[pageYOffset].clipData.concat(rect);
      } else {
        clipData[pageYOffset] = {
          fileName: path.join(dirName, `${pageYOffset}.png`),
          clipData: [rect],
        }; 
        console.log('try', path.join(ROOT_PATH, clipData[pageYOffset].fileName))
        // must take screenshot
        await page.screenshot({
          path: path.join(ROOT_PATH, clipData[pageYOffset].fileName),
        })
      }
    }
    // write clipData as a json file to dirName
    try {
      fs.writeFileSync(path.join(ROOT_PATH, dirName, 'data.json'), JSON.stringify(clipData))
    } catch(e) {
      console.log('error writing clip data', e)
      return
    }
  }
}

;(async () => {
  const { page, browser } = await getPageRef(PUPPETEER_LAUNCH_OPTIONS)
  const takeSelectorScreenshots = takeSelectorScreenshotsFactory(page);
  const siteSelectors = getSiteSelectors(playlist)
  console.log('yo', siteSelectors)
  
  for(const {url, selectors} of siteSelectors) {
    for(const selector of selectors) {
      const dirName = getDirName({url, selector})
      prepareOutputDir(dirName);
      await takeSelectorScreenshots({
        dirName: getDirName({url, selector}),
        url,
        selector,
      })
    }
  }

  await browser.close();
  process.exit(0);
})();

function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })  
}

function getSiteSelectors(playlist: {urls: string[], selectors: string[]}): SiteSelector[] {
  return playlist.urls.map((url) => ({
    url,
    selectors: playlist.selectors,
  }))
}

function getDirName({
  url,
  selector,
}: {
  url: string
  selector: string
}) {
  return `${getUrlKey(url)}:${selector}`;
}

function getUrlKey(url: string): string {
  const urlObj = new URL(url);
  const {hostname, search} = urlObj;
  const searchStr = search.replace(/([\?\&])/g, '');
  
  return `${hostname.replace(/\.\w+$/, '')}${searchStr ? '_' + searchStr : ''}`;
}

