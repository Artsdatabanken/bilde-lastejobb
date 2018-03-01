const io = require('./lib/io')
const config = require('./config')

var data = io.readJson(config.datafil.flettet)

var p2c = {}
Object.keys(data).forEach(kode => {
  const node = data[kode]
  if (kode === 'NA') console.log(node)
  if (!p2c[node.forelder]) p2c[node.forelder] = []
  if (node.forelder !== null) {
    p2c[node.forelder].push(kode)
  }
  if (node.foreldre) {
    node.foreldre.forEach(forelder => {
      if (!p2c[forelder]) p2c[forelder] = []
      p2c[forelder].push(kode)
    })
  }
})

function byggTreFra(rotKode) {
  let rot = data[rotKode]
  rot.kode = rotKode
  let node = { '@': rot }
  let barn = {}
  if (p2c[rotKode])
    p2c[rotKode].forEach(kode => {
      barn[kode] = {
        kode: kode,
        tittel: data[kode].tittel,
        relasjoner: data[kode].relasjoner
      }
      node[kode] = byggTreFra(kode)
    })
  node['@'].barn = barn
  return node
}

const r = byggTreFra('')

io.writeJson(config.datafil.metabase, r)
console.log('Skrevet ' + Object.keys(r).length + ' koder på rotnivå')
