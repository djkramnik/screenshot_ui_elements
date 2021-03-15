import * as path from 'path'
import * as fs from 'fs'
import * as express from 'express'

const app = express()
const port = 8081

const rootScreenshotPath = path.join(__dirname, '../../screenshots')

;(async function () {
  app.use(express.json())
  app.get('/api/categories', (req, res) => {
    const directories = fs.readdirSync(rootScreenshotPath, { withFileTypes: true })
    const dirNames = directories
      .filter(directory => directory.isDirectory())
      .map(directory => directory.name)
    res.status(200).send({
      categories: dirNames,
    })
  })
  
  app.listen(port, () => {
    console.log(`App listening on port ${port}`)
  })
})()