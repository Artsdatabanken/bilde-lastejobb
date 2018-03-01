const { getJsonFromCache, writeJson } = require('./lib/io')
const config = require('./config')

async function importKommuner() {
  let kommuner = await getJsonFromCache(
    'http://data.ssb.no/api/klass/v1/classifications/131/codes.json?from=2018-02-27&to=2018-02-28',
    'cache/kommuner.json'
  )
  r = {}
  kommuner.codes.forEach(ci => {
    // AO_18-50
    const fylke = config.prefix.administrativtOmråde + ci.code.substring(0, 2)
    const kode = fylke + '-' + ci.code.substring(2, 4)
    if (ci.code !== '9999') {
      r[kode] = { kode: kode, forelder: fylke, tittel: { nb: ci.name } }
    }
  })
  return r
}

importKommuner().then(r => {
  writeJson(config.datafil.kommune_60, r)
  console.log('Importert ' + Object.keys(r).length + ' kommuner')
})
