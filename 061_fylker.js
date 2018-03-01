const { getJsonFromCache, writeJson } = require('./lib/io')
const config = require('./config')

const prefix = 'AO_'
async function importKommuner() {
  let fylker = await getJsonFromCache(
    'https://data.ssb.no/api/klass/v1/versions/916.json?language=nb',
    'cache/fylker.json'
  )
  r = {}
  fylker.classificationItems.forEach(ci => {
    // AO_18
    const kode = config.prefix.administrativtOmråde + ci.code
    if (ci.code !== '99') {
      r[kode] = { kode: kode, forelder: 'AO', tittel: { nb: ci.name } }
    }
  })
  return r
}

importKommuner().then(r => {
  writeJson(config.datafil.fylke_61, r)
  console.log('Importert ' + Object.keys(r).length + ' fylker')
})
