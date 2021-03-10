import { Page } from 'puppeteer'
import { PUPPETEER_LAUNCH_OPTIONS } from './config';
import { getPageRef } from './util'

let page: Page | null = null

;(async () => {

  page = await getPageRef(PUPPETEER_LAUNCH_OPTIONS)
})()