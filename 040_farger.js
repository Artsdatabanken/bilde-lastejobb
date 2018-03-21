const io = require('./lib/io')
const config = require('./config')

let r = {
  'MI_KA-A': 'hsla(0, 0%, 0%, 0)',
  'MI_KA-B': 'hsla(0, 6%, 94%, 0.6)',
  'MI_KA-C': 'hsla(0, 19%, 88%, 0.6)',
  'MI_KA-D': 'hsla(0, 35%, 80%, 0.6)',
  'MI_KA-E': 'hsla(0, 59%, 63%, 0.6)',
  'MI_KA-F': 'hsla(0, 84%, 32%, 0.6)',
  'MI_KA-G': '',
  'MI_KA-H': '',
  'MI_KA-I': ''
}

io.writeJson(config.datafil.farger, r)
