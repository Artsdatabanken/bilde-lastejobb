const io = require('./lib/io')
const config = require('./config')

var data = io.readJson(config.datakilde.obsoletemetabase)

let r = {}

function dekod(kode, meta) {
  if (meta.navnSciId) return 'TX_' + meta.navnSciId.toString()
  if (kode==='GEO_FY') return 'AO'
    if (kode.startsWith('GEO_FY')) {
      let fylke = kode.split('-')[1].padStart(2,'0')
      return 'AO_'+fylke
  }

  if (kode.startsWith('GEO_KO')) {
    const code = parseInt(kode.substring(7, 11))
    const fylke = Math.floor(code/100)
    const kommune = (code%100).toString().padStart(2, '0')
    const r = 'AO_'  + fylke.toString().padStart(2,'0') + '-' + kommune
    console.log(r)
    return r
  }
  kode = kode.replace('GEO_KO', 'AO_')
  const parts = kode.split('-')
  if (parts.length !== 2) return kode
  if (parts[0] === 'GEO_FY') return kode
  const sciId = parseInt(kode[1], 36)
//  console.log(sciId)
  return 'TX_' + sciId.toString()
}

function flatut(pk, o) {
  const meta = o['@']
  delete meta.forelder
  delete meta.barn
  delete meta.bbox
  delete meta.prefiks
  delete meta.taxonId
  if (meta) {
    const mk = meta.kode || ''
    const fpk = mk.length > pk.length ? mk : pk
    meta.kode = dekod(fpk, meta)
    r[meta.kode] = meta
    Object.keys(o).forEach(kode => {
      if (kode !== '@') flatut(kode, o[kode])
    })
  }
}

flatut('', data)

io.writeJson(config.datafil.metagammel, r)
