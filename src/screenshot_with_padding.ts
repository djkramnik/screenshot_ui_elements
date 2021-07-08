import { PUPPETEER_LAUNCH_OPTIONS } from './config';
import { getPageRef } from './util';

export const screenshotTest = async () => {
  const { page, browser } = await getPageRef({... PUPPETEER_LAUNCH_OPTIONS, defaultViewport: null})
  await page.setViewport({width: 1400, height: 1000});
  await page.goto('https://browserdaemon.com', {waitUntil: 'domcontentloaded'});
  const handles = await page.$$('button');
  let i = 0;
  for(const handle of handles) {
    try {
      await handle.hover();
    } catch (e) {
      console.log('error')
      continue
    }
    await page.mouse.move(0,0);
    await (() => new Promise(resolve => setTimeout(resolve, 5000)))()
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
    }, handle);

    console.log('hi', rect)
    if (rect) {
      try {
        await page.screenshot({
          path: `./screen_${i++}.png`,
        });
      } catch(e) {
        console.log('error')
      }
    }
  }
}