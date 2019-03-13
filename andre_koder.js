const io = require('./lib/io')
const config = require('./config')
const { splittKode } = require('./lib/koder')

let r = {}

function nyKode(db, forelder, kode, tittel, args) {
  const node = Object.assign(
    {
      kode: kode,
      foreldre: forelder !== null ? [forelder] : [],
      tittel: { nb: tittel }
    },
    args
  )
  r[kode] = node
}

const rot = config.rotkode
nyKode(r, null, rot, 'Økologisk grunnkart')
nyKode(r, rot, 'AR', 'Art')
nyKode(r, rot, 'NA', 'Natursystem', {
  infoUrl: 'https://www.artsdatabanken.no/Pages/222921'
})
nyKode(r, rot, 'MI', 'Miljø', {
  infoUrl: 'https://artsdatabanken.no/Pages/179717',
  ingress:
    'Lokale komplekse miljøvariabler (LKM) er definert som «variabler som hver består av flere enkeltmiljøvariabler som samvarierer i mer eller mindre sterk grad, og som gir opphav til variasjon i artssammensetning på relativt fin romlig skala og som har en virkning som vedvarer over relativt lang tid [typisk mer enn 100(–200) år]»'
})
nyKode(r, rot, 'BS', 'Beskrivelse')
nyKode(r, rot, 'AO', 'Fylke & kommune', {
  utenRamme: true // Kommunevåpen har en form som gjør at det ikke passer å croppe dem til en sirkel
})
nyKode(r, rot, 'RL', 'Truet art/natur')
nyKode(r, rot, 'LI', 'Livsmedium', {
  infoUrl: 'https://artsdatabanken.no/Pages/137826',
  ingress:
    'Inndelingen på livsmedium-nivået skal gi oss begreper for å karakterisere individers og arters levebetingelser. Livsmedium-inndelingen omfatter bunn, mark, vannmasser og luft og er fullstendig dekkende for det norske fastlandet samt for havområdene og arktiske øyer under norsk suverenitet.'
})
nyKode(r, rot, 'OR', 'Datakilde', {
  utenRamme: true,
  ingress: '... tekst om dataleverandører...'
})
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

nyKode(r, 'NA', 'NA_HT', 'Hovedtyper')
nyKode(r, 'NA_HT', 'NA_HT-KG', 'Kunnskapsgrunnlag')
nyKode(
  r,
  'NA_HT-KG',
  'NA_HT-KG-GI',
  'Kunnskapsgrunnlag om grunntypeinndelingen'
)
nyKode(r, 'NA_HT-KG', 'NA_HT-KG-GI1', '1')
nyKode(r, 'NA_HT-KG', 'NA_HT-KG-GI2', '2')
nyKode(r, 'NA_HT-KG', 'NA_HT-KG-GI3', '3')
nyKode(r, 'NA_HT-KG', 'NA_HT-KG-GI4', '4')
nyKode(r, 'NA_HT-KG', 'NA_HT-KG-GI5', '5')
nyKode(r, 'NA_HT-KG', 'NA_HT-KG', 'Kunnskapsgrunnlag om hovedtypen generelt')
nyKode(r, 'NA_HT-KG', 'NA_HT-KG1', '1')
nyKode(r, 'NA_HT-KG', 'NA_HT-KG2', '2')
nyKode(r, 'NA_HT-KG', 'NA_HT-KG3', '3')
nyKode(r, 'NA_HT-KG', 'NA_HT-KG4', '4')
nyKode(r, 'NA_HT-KG', 'NA_HT-KG5', '5')
nyKode(r, 'NA_HT', 'NA_HT-PK', 'Prosedyrekategori')
nyKode(r, 'NA_HT', 'NA_HT-DG', 'Definisjonsgrunnlag')

io.writeJson(config.datafil.andre_koder, r)
