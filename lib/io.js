const fs = require('fs')
const fetch = require('node-fetch')

function fetchJson(url) {
  const data = fetch(url)
  return JSON.parse(data)
}

function readJson(filePath) {
  console.log('Reading ' + filePath)
  const data = fs.readFileSync(filePath, 'utf8')
  return (json = JSON.parse(data))
}

function writeJson(filePath, o) {
  console.log('Writing ' + filePath)
  if (!filePath) throw new Error('Filename is required')
  if (!o) throw new Error('No data provided')
  fs.writeFileSync(filePath, JSON.stringify(o))
}

async function downloadJson2File(url, targetFile) {
  console.log('Download ' + url)
  const response = await fetch(url)
  const json = await response.json()
  writeJson(targetFile, json)
}

async function getJsonFromCache(url, targetFile) {
  if (!fs.existsSync(targetFile)) await downloadJson2File(url, targetFile)
  return readJson(targetFile)
}

module.exports = {
  readJson,
  writeJson,
  fetchJson,
  getJsonFromCache,
  downloadJson2File
}
