const path = require('path')
const io = require('./lib/io')
const config = require('./config')

process.env.LOGLEVEL = 1

const kommuner = io.readJson(config.datafil.kommune_60).data
const fylker = io.readJson(config.datafil.fylke_61).data
const områder = Object.assign({}, kommuner, fylker)
//const områder = Object.assign({}, fylker)

const override = {
  //  Færder:
  //    'https://no.wikipedia.org/wiki/F%C3%A6rder#/media/File:F%C3%A6rder_komm_2018.svg',
  'Indre Fosen': 'Leksvik'
}

const overrideFiltype = {
  Horten: 'png',
  Trøndelag: 'png'
}

async function downloadImageMeta(nøkkel, suffiks = 'komm', filtype = 'svg') {
  if (overrideFiltype[nøkkel]) filtype = overrideFiltype[nøkkel]
  if (override[nøkkel]) nøkkel = override[nøkkel]
  const url = `https://no.wikipedia.org/w/api.php?action=query&format=json&prop=imageinfo&titles=Fil%3A${encodeURIComponent(
    nøkkel + '_' + suffiks
  )}%2E${filtype}&iiprop=url`

  const json = await io.getJsonFromCache(
    url,
    config.cachePath + '/våpenskjold/' + nøkkel + '_' + suffiks + '.json'
  )
  const imageinfos = json.query.pages[-1].imageinfo
  if (!imageinfos) {
    return null
  }
  const ii = imageinfos[0]
  return { url: ii.url, descriptionurl: ii.descriptionurl }
}

async function lastEn(r, kode) {
  const node = områder[kode]
  const navn = node.tittel.nb
  const forelder = node.foreldre && node.foreldre[0]
  const forelderNavn =
    forelder && områder[forelder] ? områder[forelder].tittel.nb : null
  const suffiks = forelderNavn || navn == 'Oslo' ? 'komm' : 'våpen'
  //  console.log(navn, forelder, forelderNavn, suffiks)
  // throw new Error()
  let meta = await downloadImageMeta(navn, suffiks)
  if (!meta && forelder)
    meta = await downloadImageMeta(`${navn}_${forelderNavn}`, suffiks)
  if (meta) {
    r[kode] = Object.assign(
      {
        tittel: navn
      },
      meta
    )
  } else console.warn('Fant ikke meta for ' + navn)
}

async function lastVåpen() {
  let r = {}
  for (let key of Object.keys(områder)) await lastEn(r, key)
  return r
}

lastVåpen().then(r => io.writeJson(config.datafil.våpenskjold_meta, r))
