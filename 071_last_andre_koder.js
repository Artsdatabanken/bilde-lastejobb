const io = require('./lib/io')
const config = require('./config')
const { splittKode } = require('./lib/koder')

let r = {}

function nyKode(db, forelder, kode, tittel, tittelLa, url) {
  const node = {
    kode: kode,
    foreldre: forelder !== null ? [forelder] : [],
    tittel: { nb: tittel }
  }
  if (tittelLa) node.tittel.la = tittelLa
  if (url) node.url = url
  r[kode] = node
}

const rot = config.rotkode
nyKode(r, null, rot, 'Katalog')
nyKode(r, rot, 'AR', 'Art', 'Biota', 'Biota')
nyKode(r, rot, 'NA', 'Natursystem')
nyKode(r, rot, 'MI', 'Miljø')
nyKode(r, rot, 'BS', 'Beskrivelse')
nyKode(r, rot, 'AO', 'Fylke & kommune')
nyKode(r, rot, 'RL', 'Truet art')
nyKode(r, rot, 'LI', 'Livsmedium')
nyKode(r, 'RL', 'RL_EN', 'Sterkt truet')
nyKode(r, 'RL', 'RL_VU', 'Sårbar')
nyKode(r, 'RL', 'RL_RE', 'Regionalt utdødd')
nyKode(r, 'RL', 'RL_NT', 'Nær truet')
nyKode(r, 'RL', 'RL_NA', 'Ikke vurdert')
nyKode(r, 'RL', 'RL_DD', 'Datamangel')
nyKode(r, rot, 'FA', 'Fremmed art')
nyKode(r, 'FA', 'FA_SE', 'Svært høy risiko')
nyKode(r, 'FA', 'FA_HI', 'Høy risiko')
nyKode(r, 'FA', 'FA_PH', 'Potensielt høy risiko')
nyKode(r, 'FA', 'FA_LO', 'Lav risiko')
nyKode(r, 'FA', 'FA_NK', 'Ingen kjent risiko')
nyKode(r, rot, 'LI', 'Livsmedium')
nyKode(r, 'LI', 'LI_MS', 'Substrat i marine systemer')
nyKode(r, 'LI', 'LI_MS-M7', 'Dødt plantemateriale i marine systemer')
nyKode(r, 'LI', 'LI_TS', 'Substrat på land')
nyKode(r, 'LI', 'LI_TS-T3', 'Organisk jord')
nyKode(r, 'LI', 'LI_TS-T4', 'Levende planter på land')
nyKode(r, 'LI', 'LI_TS-T6', 'Ved-livsmedier')
nyKode(r, 'LI', 'LI_TS-T10', 'Dødt plantemateriale')
nyKode(r, 'LI', 'LI_TS-T10_M7', 'Dødt plantemateriale i marine systemer')

io.writeJson(config.datafil.andre_koder, r)
