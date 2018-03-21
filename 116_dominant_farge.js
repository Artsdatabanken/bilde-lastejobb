const io = require('./lib/io')
const config = require('./config')
const fs = require('fs')
const log = require('./lib/log')
const { spawnSync } = require('child_process')

let r = {}
const fn = '../image/processed/kode/40/OR_KV.png'
const args = [
  fn,
  '-format',
  '%c',
  '-depth',
  '8',
  'histogram:info:histogram_image.txt'
]

const x = spawnSync('convert', args)
//let data = fs.readFileSync('histogram_image.txt', 'utf8')
let data = io.readCsv('histogram_image.txt', ' ')
console.log(data)

data = data.split('\n').map(x => {
  var p = x.split(':')
  console.log(p)
  return { count: parseInt(x[0]), color: x[1] }
})
//console.log(data)

//r.farge = farge
writeJson(config.datafil.dominant_farge, r)
