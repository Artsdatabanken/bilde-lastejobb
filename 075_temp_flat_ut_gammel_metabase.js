const io = require('./lib/io')
const config = require('./config')

var data = io.readJson(config.datafil.obsoletemetabase)

let r = []
Object.keys(data).forEach(kode => {
  const node = data[kode]
  const foreldre = node.foreldre || [node.forelder]
  const tittel = node.tittel ? node.tittel.nb || node.tittel.la : '?'
  if (!node.tittel) console.log(kode)
  foreldre.forEach(forelder =>
    r.push({ kode: kode, forelder: forelder, tittel: tittel })
  )
})

io.writeJson(config.datafil.kodetre, r)
console.log('Skrevet ' + r.length + ' koder')
