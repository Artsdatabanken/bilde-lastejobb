const { getJsonFromCache, writeJson } = require('./lib/io')
const config = require('./config')

async function importKommuner() {
  let fylker = await getJsonFromCache(
    'https://data.ssb.no/api/klass/v1/versions/916.json?language=nb',
    config.cachePath + '/ssb/fylker.json'
  )
  r = {}
  fylker.classificationItems.forEach(ci => {
    // AO_18
    const kode = config.prefix.administrativtOmråde + ci.code
    console.log(ci.name)

    ci.name = ci.name.replace('Troms Romsa', 'Troms')
    ci.name = ci.name.replace('Finnmark Finnmárku', 'Finnmark')
    console.log(ci.name)
    if (ci.code !== '99') {
      r[kode] = { kode: kode, foreldre: ['AO'], tittel: { nb: ci.name } }
    }
  })
  return r
}

importKommuner().then(r => {
  writeJson(config.datafil.fylke_61, r)
})
