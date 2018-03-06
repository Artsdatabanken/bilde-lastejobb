const io = require('./lib/io')
const config = require('./config')
const log = require('./lib/log')

var osmosis = require('osmosis')
const fs = require('fs')

let nin_liste = io.readJson(config.datafil.nin_liste).data
let r = {}

async function hentfotolinker(nin_liste) {
  const keys = Object.keys(nin_liste)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    console.log('1')
    await hentfotolink(nin_liste[key])
    console.log('2')
  }
}

async function hentfotolink(item) {
  const wwwkode = item.kode.replace('NA_', '')
  const ninkode = item.kode
  if (r[ninkode]) {
    return
  }
  //  if (wwwkode != 'T1') return
  log.w('READ', ninkode)
  await osmosis
    .get('https://www.artsdatabanken.no/NiN2.0/' + wwwkode)
    .find('form a')
    .set({
      foto: 'img@src'
    })
    .data(function(www) {
      const foto = www.foto.replace('?mode=320x320', '')
      console.log(foto)
      const url = www.foto ? `https://artsdatabanken.no${foto}` : undefined
      r[ninkode] = { foto: url }
    })
    //.log(console.log)
    .error(error => {
      log.e(error)
    })
    .log(console.log)
    .debug(console.log)
    //.debug(console.log)
    .done()
  console.log('done')
}

hentfotolinker(nin_liste).then(() => io.writeJson(config.datafil.nin_foto, r))
