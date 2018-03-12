const config = require('./config')
const io = require('./lib/io')

const meta = io.readJson(config.datafil.våpenskjold_meta)

async function lastEn(kode) {
  const node = meta[kode]
  const targetFile = config.imagePath.source + '/' + kode + '.' + node.filtype
  if (io.fileExists(targetFile)) return
  const json = await io.getBinaryFromCache(node.url, targetFile)
}

async function lastVåpen() {
  for (let key of Object.keys(meta)) await lastEn(key)
  return 'OK'
}

lastVåpen().then(r => console.log(r))
