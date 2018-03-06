const io = require('./lib/io')
const config = require('./config')
const { erKartleggingsnivå } = require('./lib/koder')
const { capitalizeTittel } = require('./lib/koder')

let koder = io.readJson(config.datafil.nin_koder).data

function kodefix(kode) {
  if (!kode) return kode
  return kode.toUpperCase().replace(' ', '_')
}

async function importerGrunntypeKoblinger(kode, mineGrunntyper) {
  const url = config.datakilde.nin_api_graf + '/' + kode.replace('NA_', '')
  const json = await io.getJsonFromCache(
    url,
    config.getCachePath('nin_api_graf') + '/' + kode + '.json'
  )
  const klassifisering = json.Klassifisering[0].Grunntypeinndeling
  klassifisering.forEach(gtf => {
    const namespace = 'https://www.artsdatabanken.no/api/graph/NiN2.0/'
    const gt = config.prefix.natursystem + gtf.replace(namespace, '')
    if (!mineGrunntyper[kode]) mineGrunntyper[kode] = []
    mineGrunntyper[kode].push(gt)
  })
}

let kodeliste = {}

async function importerKoder() {
  const mineGrunntyper = {}
  const mineKoder = {}
  for (let node of koder) {
    const kode = kodefix(node.Kode.Id)
    const forelder = kodefix(node.OverordnetKode.Id || null)
    const tittel = { nb: capitalizeTittel(node.Navn) }
    if (erKartleggingsnivå(kode))
      await importerGrunntypeKoblinger(kode, mineGrunntyper)
    let o = { tittel: tittel }
    o.foreldre = forelder ? [forelder] : [config.rotkode]
    mineKoder[kode] = o
  }
  return { grunntyper: mineGrunntyper, koder: mineKoder }
}

importerKoder().then(imp => {
  io.writeJson(config.datafil.nin_grunntyper, imp.grunntyper)
  io.writeJson(config.datafil.nin_koder_importert, imp.koder)
})
