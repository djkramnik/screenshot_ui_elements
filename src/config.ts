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

export const MAX_SCROLLS = 5

const selectors = [
  'button',
  'a',
  'input'
]

const urls = [
  'https://www.youtube.com',
  'https://www.google.com',
  'https://www.replay.io',
  'https://www.rottentomatoes.com',
  'https://www.prodigygame.com',
  'https://www.espn.com',
  'https://www.toronto.ca',
  'https://www.linkedin.com',
]

export const playlist: SiteSelector[] = selectors.reduce((result: SiteSelector[], selector: string) => {
  return result.concat(
    urls.map(url => ({
      url,
      selector,
    }))
  )
}, [] as SiteSelector[])

