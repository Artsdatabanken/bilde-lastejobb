const io = require('./lib/io')
const config = require('./config')

let koder = io.readJson(config.datafil.nin_liste)
let bboxIn = io.readJson(config.datakilde.bbox)

console.log('Lest ' + Object.keys(bboxIn).length + ' bboxer')
function prefixedKode(kode) {
  kode = kode.toUpperCase()
  if (kode[2] === '_') return kode
  if ('0123456789'.indexOf(kode[0]) >= 0) return 'BS_' + kode
  return 'MI_' + kode
}

let bbox = {}
for (let key of Object.keys(bboxIn)) {
  bbox[prefixedKode(key)] = bboxIn[key]
}

function round(num) {
  return Math.round(num * 1000) / 1000
}

function map(bbox) {
  return [[round(bbox[2]), round(bbox[3])], [round(bbox[0]), round(bbox[1])]]
}

let count = 0
for (let kode of Object.keys(koder)) {
  if (bbox[kode]) {
    let node = koder[kode]
    node.bbox = map(bbox[kode])
    count++
  }
}

let missed = []
for (let kode of Object.keys(bbox)) {
  if (!koder[kode]) missed.push(kode)
}
console.log('Ukjente koder: ', missed.join(' '))
io.writeJson(config.datafil.kodetre_30 + '_skipped.json', missed)
io.writeJson(config.datafil.kodetre_30, koder)
console.log('Importert ' + count + ' bboxer')
