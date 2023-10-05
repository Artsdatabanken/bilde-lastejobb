const {io, config, log} = require('@artsdatabanken/lastejobb')

log.logLevel = 5

var osmosis = require('osmosis')

let nin_liste = io.readJson(config.datafil.nin_liste)
let r = {}

function hentfotolink(item, callback) {
  console.log(item.kode)
  const wwwkode = item.kode.replace('NA', '').replace('_', '')
  if (!wwwkode) {
    console.log('empty')
    callback()
    return
  }
  const ninkode = item.kode
  console.log(wwwkode)
  //  if (wwwkode != 'T1') return
  log.d('READ', ninkode)
  osmosis
    .get('https://www.artsdatabanken.no/NiN2.0/' + wwwkode)
    .find('form a')
    .set({
      foto: 'img@src'
    })
    .data(function(www) {
      let foto = www.foto
      if (!foto) {
        return callback()
      }
      foto = foto.replace('?mode=320x320', '')
      log.v('Fant foto: ', foto)
      const url = www.foto ? `https://artsdatabanken.no${foto}` : undefined
      r[ninkode] = { foto: url }
      //      io.writeJson(config.datafil.nin_foto, r)
      return callback()
    })
    .error(error => {
      log.e(error)
      return callback()
    })
    .log(console.log)
    .debug(log.d)
  //.debug(console.log)
}

function addCustom(r) {
  r['LA'] = { foto: 'https://www.artsdatabanken.no/Media/F1168' }
  r['NA'] = { foto: 'https://www.artsdatabanken.no/Media/F1395' }
  r['LD'] = { foto: 'https://www.artsdatabanken.no/Media/F1182' }
  r['LI'] = { foto: 'https://www.artsdatabanken.no/Media/F1307' }
  r[config.rotkode] = { foto: 'https://www.artsdatabanken.no/Media/F21489' }
}

const hentfotolinker = async (nin_liste) => {
  const keys = Object.keys(nin_liste)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (key.indexOf(config.prefix.natursystem) === 0) {
      await hentfotolink(nin_liste[key])
      addCustom(r)
      io.writeJson(config.datafil.nin_foto, r)
    }
  }
  log.v('Lagrer')
  io.writeJson(config.datafil.nin_foto, r)
  log.v('Ferdig.')
}

hentfotolinker(nin_liste)
