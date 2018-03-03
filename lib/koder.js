const DATAKEY = '@'

function hovedtype(subkode) {
  return subkode.split('-')[0]
}

function erGrunntype(kode) {
  if (kode.match(/NA_[A-Z][0-9]+-[0-9]+/gi)) return true
}

function erKartleggingsnivå(kode) {
  if (kode.match(/-E-/gi)) return true
  if (kode.match(/-C-/gi)) return true
}

function capitalizeTittel(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function kodkode(scientificNameId, codePrefix = 'TX_') {
  return codePrefix + scientificNameId.toString(36).toUpperCase()
}

function splittKode(kode) {
  let segments = kode.match(/[a-zA-Z]+|[0-9]+/g)
  return segments || []
}

function lookupBarn(db, kode) {
  let node = lookup(db, kode)
  const keys = Object.keys(node)
  return keys.filter(kode => kode !== DATAKEY)
}

function hentFlatt(db, prefix = '') {
  let flat = {}
  lookupBarn(db).forEach(k => {
    flat[prefix ? prefix + '/' + k : k] = db[k]
    Object.assign(flat, kiddos.forEach(lookupBarn(db[k])))
  })
}

function lookup(db, kode) {
  if (!kode) return db
  const path = splittKode(kode)
  let forelder = null
  for (var i = 0; i < path.length; i++) {
    const seg = path[i]
    if (!db[seg]) {
      console.log('!DB')
      return null
    }
    forelder = db
    db = db[seg]
  }
  return db
}

function lookupWithCreate(db, kode) {
  if (!kode) return db
  const path = splittKode(kode)
  let forelder = null
  path.forEach(seg => {
    if (!db[seg]) {
      db[seg] = {
        '@': {
          kode: kode,
          barn: {},
          forelder: { kode: db['@'].kode, tittel: db['@'].tittel }
        }
      }
    }
    forelder = db
    db = db[seg]
  })
  return db
}

module.exports = {
  DATAKEY,
  kodkode,
  splittKode,
  lookup,
  lookupWithCreate,
  lookupBarn,
  hentFlatt,
  capitalizeTittel,
  erGrunntype,
  erKartleggingsnivå,
  hovedtype
}
