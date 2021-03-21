import {scrapeSelectors} from './scrapeSelectors'
import {getFlatIconKey, mapFlatIconUrlToDomain} from './util'

;(async () => {
 await scrapeSelectors(mapFlatIconUrlToDomain, getFlatIconKey)
})()