const io = require('./lib/io')
const config = require('./config')
const { splittKode } = require('./lib/koder')

let r = {}

function nyKode(db, forelder, kode, tittel) {
  const node = { kode: kode, forelder: forelder, tittel: { nb: tittel } }
  r[kode] = node
}

nyKode(r, null, '', 'Katalog')
nyKode(r, '', 'NA', 'Natursystem')
nyKode(r, '', 'MI', 'Miljø')
nyKode(r, '', 'BS', 'Beskrivelse')
nyKode(r, '', 'AO', 'Fylke & kommune')
nyKode(r, '', 'RL', 'Truet art')
nyKode(r, 'RL', 'RL_EN', 'Sterkt truet')
nyKode(r, 'RL', 'RL_VU', 'Sårbar')
nyKode(r, 'RL', 'RL_RE', 'Regionalt utdødd')
nyKode(r, 'RL', 'RL_NT', 'Nær truet')
nyKode(r, 'RL', 'RL_NA', 'Ikke vurdert')
nyKode(r, 'RL', 'RL_DD', 'Datamangel')
nyKode(r, '', 'FA', 'Fremmed art')
nyKode(r, 'FA', 'FA_SE', 'Svært høy risiko')
nyKode(r, 'FA', 'FA_HI', 'Høy risiko')
nyKode(r, 'FA', 'FA_PH', 'Potensielt høy risiko')
nyKode(r, 'FA', 'FA_LO', 'Lav risiko')
nyKode(r, 'FA', 'FA_NK', 'Ingen kjent risiko')
nyKode(r, '', 'LI', 'Livsmedium')
nyKode(r, 'LI', 'LI_MS', 'Substrat i marine systemer')
nyKode(r, 'LI', 'LI_MS-M7', 'Dødt plantemateriale i marine systemer')
nyKode(r, 'LI', 'LI_TS', 'Substrat på land')
nyKode(r, 'LI', 'LI_TS-T3', 'Organisk jord')
nyKode(r, 'LI', 'LI_TS-T4', 'Levende planter på land')
nyKode(r, 'LI', 'LI_TS-T6', 'Ved-livsmedier')
nyKode(r, 'LI', 'LI_TS-T10', 'Dødt plantemateriale')
nyKode(r, 'LI', 'LI_TS-T10_M7', 'Dødt plantemateriale i marine systemer')

console.log('Importert ' + Object.keys(r).length + ' koder')
io.writeJson(config.datafil.andre_koder, r)
