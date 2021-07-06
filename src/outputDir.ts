import * as fs from 'fs'
import * as path from 'path'

const cachedDomains: string[] = []
export const ROOT_PATH = path.join(__dirname, '../screenshots')

// where url is https://{domain}.{tld}
export function getDomainFromUrl(url: string): string {
  const matchedUrl = url.replace('www.', '')
    .match(/^https:\/\/(\w+)\.(\w+)(\?\w+=\w+)?(\&\w+=\w+)?$/)
  const domain = matchedUrl?.[1]
  if (!domain) {
    throw new Error('bad url or something')
  }
  return domain
}

export function getDirNameFromUrl(url: string): string {
  const urlObj = new URL(url);
  const {hostname, search} = urlObj;
  const searchStr = search.replace(/([\?\&])/g, '');
  
  return `${hostname.replace(/\.\w+$/, '')}${searchStr ? '_' + searchStr : ''}`;
}

export function prepareOutputDir(dirName: string) {
  if (cachedDomains.includes(dirName)) {
    return
  }

  const susPath = path.join(ROOT_PATH, dirName)
  // if the path doesn't exist then create a directory in screenshots
  if (!fs.existsSync(susPath)) {
    fs.mkdirSync(susPath)
  }
  cachedDomains.concat(dirName)
}