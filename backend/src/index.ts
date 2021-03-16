import * as path from 'path'
import * as fs from 'fs'
import * as express from 'express'

const app = express()
const port = 8081

const rootScreenshotPath = path.join(__dirname, '../../screenshots')
const rootFrontendPath = path.join(__dirname, '../../frontend')

;(async function () {
  app.use(express.json())
  app.use('/img', express.static(rootScreenshotPath))
  app.use(express.static(rootFrontendPath))
  app.use(/\.js$/, (req, res) => {
    res.set('Content-Type', 'text/javascript')
    res.sendFile(path.join(rootFrontendPath, 'index.js'))
  })
  app.use(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(rootFrontendPath, 'index.html'))
  })
  
  app.get('/api/categories', (req, res) => {
    const directories = fs.readdirSync(rootScreenshotPath, { withFileTypes: true })
    const dirNames = directories
      .filter(directory => directory.isDirectory())
      .map(directory => directory.name)
    res.status(200).send({
      categories: dirNames,
    })
  })

  app.delete('/api/categories/:name/:file', (req, res) => {
    const {name, file} = req.params
    // lets just assume its ok
    fs.unlink(path.join(rootScreenshotPath, name, file), () => ({}))
    res.status(200).send('ok')
  })

  app.get('/api/categories/:name', (req, res) => {
    const {name} = req.params

    const fileNames = fs.readdirSync(
      path.join(rootScreenshotPath, name), { withFileTypes: true }
    ).reduce((fileNames, entry) => {
      return entry.isFile() ? fileNames.concat(entry.name) : fileNames
    },[] as string[])
    res.status(200).send({  
      files: fileNames,
    })
  })
  
  app.listen(port, () => {
    console.log(`App listening on port ${port}`)
  })
})()