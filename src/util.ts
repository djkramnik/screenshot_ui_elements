import { LaunchOptions, Page, launch } from "puppeteer"

export const getPageRef = async (options: LaunchOptions) => {
  const browser = await launch(options)
  const page = await browser.newPage()
  page.setDefaultNavigationTimeout(0)
  page.setViewport({width: 1400, height: 1000})
  return page
}

export async function screenshotBoundingRect({
  page,
  boundingRect,
  padding = 0,
  path,
}: {
  page: Page
  boundingRect: DOMRect
  padding?: number
  path: string
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