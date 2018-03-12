const io = require('./lib/io')
const config = require('./config')
const log = require('./lib/log')

const fotos = io.readJson(config.datafil.nin_foto)

async function download(kode) {
  const url = fotos[kode].foto
  console.log(kode, url)
  const targetFile = config.imagePath.source + '/' + kode + '.jpg'
  if (!io.fileExists(targetFile)) {
    log.v('not in cache', targetFile)
    await io.getBinaryFromCache(url, targetFile)
  }
}

async function downThemAll() {
  const keys = Object.keys(fotos)
  for (let i = 0; i < keys.length; i++) await download(keys[i])
}

downThemAll().then(x => log.i(x))
