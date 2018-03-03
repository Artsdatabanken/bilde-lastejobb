const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const { capitalizeTittel } = require('./koder')

function getLength(o) {
  if (o.length) return o.length
  return Object.keys(o).length
}

function fetchJson(url) {
  const data = fetch(url)
  return JSON.parse(data)
}

function skrivLoggLinje(aksjon, filePath, json) {
  let produsert = null
  if (json.meta && json.meta.produsert)
    produsert = new Date(json.meta.produsert)
  else produsert = new Date(fs.statSync(filePath).ctime)
  const now = new Date()
  const timerGammel = Math.round(10 * (now - produsert) / 1000 / 60 / 60) / 10

  if (json.data) json = json.data
  console.log(
    'Lest ' +
      getLength(json) +
      ' elementer fra ' +
      timerGammel +
      ' timer gammel fil.'
  )
}

function readJson(filePath) {
  console.log('Åpner ' + filePath)
  const data = fs.readFileSync(filePath, 'utf8')
  const json = JSON.parse(data)
  skrivLoggLinje('Lest', filePath, json)
  return json
}

function writeJson(filePath, o) {
  if (!filePath) throw new Error('Filename is required')
  if (!o) throw new Error('No data provided')
  console.log('Writing ' + filePath)
  const basename = path.basename(filePath, '.json')
  const dokument = {
    meta: {
      tittel: capitalizeTittel(basename.replace(/_/g, ' ')),
      produsert: new Date().toJSON(),
      utgiver: 'Artsdatabanken',
      url: `https://firebasestorage.googleapis.com/v0/b/grunnkart.appspot.com/o/koder%2F${path.basename(
        filePath
      )}?alt=media`,
      elementer: getLength(o)
    },
    data: o
  }
  fs.writeFileSync(filePath, JSON.stringify(dokument), 'utf8')
  console.log('Skrevet ' + getLength(o) + ' elementer')
}

async function downloadJson2File(url, targetFile) {
  console.log('Download ' + url)
  const response = await fetch(url)
  const json = await response.json()
  fs.writeFileSync(targetFile, JSON.stringify(json), 'utf8')
}

async function getJsonFromCache(url, targetFile) {
  const inCache = fs.existsSync(targetFile)
  if (!inCache) await downloadJson2File(url, targetFile)
  return readJson(targetFile)
}

module.exports = {
  readJson,
  writeJson,
  fetchJson,
  getJsonFromCache,
  downloadJson2File
}
