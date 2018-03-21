const { getJsonFromCache, writeJson } = require('./lib/io')
const config = require('./config')
const log = require('./lib/log')

async function importKommuner() {
  let fylker = await getJsonFromCache(
    'https://data.ssb.no/api/klass/v1/versions/916.json?language=nb',
    config.cachePath + '/ssb/fylker.json'
  )
  r = {}
  fylker.classificationItems.forEach(ci => {
    // AO_18
    const kode = config.prefix.administrativtOmråde + ci.code
    const origName = ci.name

    ci.name = ci.name.replace('Troms Romsa', 'Troms')
    ci.name = ci.name.replace('Finnmark Finnmárku', 'Finnmark')
    if (origName !== ci.name) log.i('Endret navn', origName, '=>', ci.name)
    if (ci.code !== '99') {
      r[kode] = {
        kode: kode,
        foreldre: ['AO'],
        tittel: { nb: ci.name },
        utenRamme: true //Kommunevåpen har en form som gjør at det ikke passer å croppe dem til en sirkel
      }
    }
  })
  return r
}

importKommuner().then(r => {
  writeJson(config.datafil.fylke_61, r)
})
