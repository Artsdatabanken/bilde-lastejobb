const io = require('./lib/io')
const config = require('./config')
const log = require('./lib/log')
var deasync = require('deasync')

log.logLevel = 5

var osmosis = require('osmosis')
const fs = require('fs')

let nin_liste = io.readJson(config.datafil.nin_liste).data
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

function hentfotolinker(nin_liste) {
  const keys = Object.keys(nin_liste)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (key.indexOf(config.prefix.natursystem) === 0) {
      let done = false
      hentfotolink(nin_liste[key], () => {
        done = true
      })
      deasync.loopWhile(function() {
        return !done
      })
      io.writeJson(config.datafil.nin_foto, r)
    }
  }
  log.v('Lagrer')
  io.writeJson(config.datafil.nin_foto, r)
  log.v('Ferdig.')
}

hentfotolinker(nin_liste).then(() => {
  log.w('OK')
})
