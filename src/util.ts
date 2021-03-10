import * as puppeteer from 'puppeteer'
import { LaunchOptions } from "puppeteer"

export const getPageRef = async (options: LaunchOptions) => {
  const browser = await puppeteer.launch(options)
  const page = await browser.newPage()
  page.setDefaultNavigationTimeout(0)
  page.setViewport({width: 1400, height: 1000})
  return page
}