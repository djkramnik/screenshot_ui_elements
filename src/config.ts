import { LaunchOptions } from "puppeteer";

const ext = '/Users/davidgurr/workspace/uBlock0.chromium'
export const PUPPETEER_LAUNCH_OPTIONS: LaunchOptions = {
  headless: false,
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  args: [`--disable-extensions-except=${ext}`, `--load-extension=${ext}`],
  defaultViewport: null,
}

