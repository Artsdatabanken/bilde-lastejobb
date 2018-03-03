const io = require('./lib/io')
const config = require('./config')

var data = io.readJson(config.datafil.flettet).data

function settInn(kode, forelder, tittel) {
    r.push({ kode: kode, forelder: forelder, tittel: tittel })
}

let r = []
Object.keys(data).forEach(kode => {
  const node = data[kode]
  let foreldre = node.foreldre
  if (!foreldre) foreldre = []
  const tittel = node.tittel ? node.tittel.nb || node.tittel.la : '?'
  if (kode === config.rotkode)
    settInn(kode,  null, tittel )
  if (foreldre.length > 0) {
    foreldre.forEach(forelder =>
    settInn(kode,  forelder, tittel )
    )
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

console.log(data['NA_T34-C-6'])
console.log(finn('NA_T34-C-6'))

io.writeJson(config.datafil.kodetre, r)
