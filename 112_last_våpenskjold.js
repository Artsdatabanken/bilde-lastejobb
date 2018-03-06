const io = require('./lib/io')
const config = require('./config')

const meta = io.readJson(config.datafil.våpenskjold_meta).data

async function lastEn(kode) {
  const node = meta[kode]
  const json = await io.getBinaryFromCache(
    node.url,
    config.imagePath.source + '/' + kode + '.' + node.filtype
  )
}

async function lastVåpen() {
  for (let key of Object.keys(meta)) await lastEn(key)
  return 'OK'
}

lastVåpen().then(r => console.log(r))
