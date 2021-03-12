import { LaunchOptions } from "puppeteer";

export type SiteSelector = {
  url: string
  selector: string
}

export const PUPPETEER_LAUNCH_OPTIONS: LaunchOptions = {
  headless: false,
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  defaultViewport: null,
}

const selectors = [
  'button',
  'a',
  'input'
]

const urls = [
  'https://youtube.com',
  'https://google.com',
  'https://replay.io',
  'https://rottentomatoes.com',
  'https://prodigygame.com',
  'https://toronto.ca',
  'https://espn.com',
  'https://linkedin.com',
]

export const playlist: SiteSelector[] = selectors.reduce((result: SiteSelector[], selector: string) => {
  return result.concat(
    urls.map(url => ({
      url,
      selector,
    }))
  )
}, [] as SiteSelector[])

