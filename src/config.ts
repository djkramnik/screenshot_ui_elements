import { LaunchOptions } from "puppeteer";

export type SiteSelector = {
  url: string
  selector: string
}

export const PUPPETEER_LAUNCH_OPTIONS: LaunchOptions = {
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  defaultViewport: null,
}

export const MAX_SCROLLS = 5

