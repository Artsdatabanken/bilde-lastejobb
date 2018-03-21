const { getJsonFromCache, writeJson } = require('./lib/io')
const config = require('./config')

function parseSpråk(s) {
  switch (s) {
    case 'Gáivuotna - Kåfjord - Kaivuono':
      return 'Kåfjord'
    case 'Fauske - Fuosko':
      return 'Fauske'
    case 'Hamarøy - Hábmer':
      return 'Hamarøy'
    case 'Divtasvuodna - Tysfjord':
      return 'Tysfjord'
    case 'Sortland - Suortá':
      return 'Sortland'
    case 'Harstad - Hárstták':
      return 'Harstad'
    case 'Loabák - Lavangen':
      return 'Lavangen'
    case 'Storfjord - Omasvuotna - Omasvuono':
      return 'Storfjord'
    case 'Gáivuotna - Kåfjord - Kaivuono':
      return 'Kåfjord'
    case 'Guovdageaidnu - Kautokeino':
      return 'Kautokeino'
    case 'Porsanger - Porsángu - Porsanki':
      return 'Porsanger'
    case 'Kárášjohka - Karasjok':
      return 'Karasjok'
    case 'Deatnu - Tana':
      return 'Tana'
    case 'Unjárga - Nesseby':
      return 'Nesseby'
    case 'Snåase - Snåsa':
      return 'Snåsa'
    case 'Raarvihke - Røyrvik':
      return 'Røyrvik'
  }
  return s
}

async function importKommuner() {
  let kommuner = await getJsonFromCache(
    'http://data.ssb.no/api/klass/v1/classifications/131/codes.json?from=2018-02-27&to=2018-02-28',
    config.cachePath + '/ssb/kommuner.json'
  )
  r = {}
  kommuner.codes.forEach(ci => {
    // AO_18-50
    const fylke = config.prefix.administrativtOmråde + ci.code.substring(0, 2)
    const kode = fylke + '-' + ci.code.substring(2, 4)
    if (ci.code !== '9999') {
      r[kode] = {
        kode: kode,
        foreldre: [fylke],
        tittel: { nb: parseSpråk(ci.name) },
      }
    }
  })
  return r
}

importKommuner().then(r => {
  writeJson(config.datafil.kommune_60, r)
})
