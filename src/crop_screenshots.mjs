import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url';
import {exec} from 'child_process'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootPath = path.join(__dirname, '../screenshots');

function getDirectories(path) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path+'/'+file).isDirectory();
  });
}

function asyncExec(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout) => {
      if (err) {
        reject(err)
      } else {
        resolve(stdout)
      }
    });
  })
}

async function cropWithffmpeg({
  width,
  height,
  x,
  y,
  fileIn,
  fileOut,
}) {
  try {
    await asyncExec(`ffmpeg -i ${fileIn} -vf crop="${width}:${height}:${x}:${y}" ${fileOut}`)
  } catch(e) {
    console.error('error in ffmpeg', e)
  }
}

!(async () => {
  const childDirectories = getDirectories(rootPath);

  for(const dir of childDirectories) {
    const pathToClipData = path.join(rootPath, dir, 'data.json')
    if (!fs.existsSync(pathToClipData)) {
      console.error('expected file is missing', pathToClipData)
      continue
    }
    try {
      const data = JSON.parse(fs.readFileSync(pathToClipData, 'utf8'));
      // create output directory 
      const outputDirPath = path.join(rootPath, dir, 'results')
      if (!fs.existsSync(outputDirPath)) {
        fs.mkdirSync(outputDirPath);
      }
     
      for(const [, entry] of Object.entries(data)) {
        const fileInPath = path.join(rootPath, entry.fileName)

        for(const rect of entry.clipData) {
          await cropWithffmpeg({
            width: rect.width,
            height: rect.height,
            x: rect.x,
            y: rect.y,
            fileIn: fileInPath,
            fileOut: path.join(rootPath, dir, `./results/${new Date().getTime()}.png`),
          })
        }
      }
    } catch(e) {
      console.log('wtf', e)
    }
  }
})();