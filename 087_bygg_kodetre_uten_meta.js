const io = require('./lib/io')
const config = require('./config')

var data = io.readJson(config.datafil.flettet)

function settInn(kode, forelder, tittel) {
  r.push({ kode: kode, forelder: forelder, tittel: tittel })
}

let r = []
Object.keys(data).forEach(key => {
  const node = data[key]
  if (node.se) {
  } else {
    const kode = node.kode
    if (!kode) console.warn(node)
    let foreldre = node.foreldre
    if (!foreldre) foreldre = []
    if (!kode) {
      console.error(node)
      throw new Error()
    }
    if (kode === config.rotkode) settInn(kode, null, node.tittel)
    if (foreldre.length > 0) {
      foreldre.forEach(forelder => settInn(kode, forelder, node.tittel))
    }
  }
})

function finn(kode) {
  return r.filter(node => node.kode === kode)
}

function valider(kode) {
  const node = finn(kode)
  if (!node) throw new Error('Mangler ' + kode)
  console.log(node)
}

valider('NA')

console.log(data['NA_T44'])
console.log(finn('NA_T44'))
console.log(finn('BS_1'))

io.writeJson(config.datafil.kodetre, { data: r })
