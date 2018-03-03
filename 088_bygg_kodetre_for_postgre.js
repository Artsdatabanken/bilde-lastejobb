const io = require('./lib/io')
const config = require('./config')

const dummySuperRoot = '##'
var data = io.readJson(config.datafil.flettet).data
let r = []

Object.keys(data).forEach(forelder => {
  const node = data[forelder]
  node.barn = []
})

function dyttInn(kode) {
  const node = data[kode]
  node.kode = kode
  node.tittel = node.tittel ? node.tittel.nb || node.tittel.la : '?'
  let foreldre = node.foreldre
  if (!foreldre) {
    console.warn('Mangler forelder: ' + kode)
    return
  }

  foreldre.forEach(forelder => {
    let fn = data[forelder]
    if (!fn) {
      console.warn('Finner ikke kode ', forelder)
      return
    }
    fn.kode = forelder
    fn.barn.push(node)
  })
}

function eksporter(node, forfedre, nivå = 0) {
  if (!node.barn) {
    return
  }
  forfedre = Object.assign([], forfedre)
  if (node.kode !== dummySuperRoot) forfedre.push(node.kode)
  node.barn.forEach(b => {
    const rel = {
      kode: b.kode,
      nivå: nivå,
      forfedre: forfedre,
      tittel: b.tittel
    }
    r.push(rel)
    eksporter(b, forfedre, nivå + 1)
  })
}

Object.keys(data).forEach(kode => {
  dyttInn(kode)
})

eksporter({ kode: dummySuperRoot, barn: [data[config.rotkode]] }, [])

io.writeJson(config.datafil.koder_med_forfedre, r)
