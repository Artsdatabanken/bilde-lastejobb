const io = require('./lib/io')
const config = require('./config')

let db = {}

function nyKode(forelder, kode, farge, tittel, infoUrl) {
  const node = {
    kode: kode,
    foreldre: forelder !== null ? [forelder] : [],
    farge: farge,
    tittel: { nb: tittel }
  }
  if (infoUrl) node.infoUrl = infoUrl
  db[kode] = node
}

nyKode(
  'OR',
  'OR_ADB',
  'hsl(24, 100%, 50%)',
  'Artsdatabanken',
  'https://www.artsdatabanken.no'
)
nyKode(
  'OR',
  'OR_KV',
  'hsl(209, 98%, 33%)',
  'Kartverket',
  'https://www.kartverket.no'
)
nyKode(
  'OR',
  'OR_MDIR',
  'hsl(177, 93%, 24%)',
  'Miljødirektoratet',
  'https://www.miljodirektoratet.no'
)
nyKode(
  'OR',
  'OR_NGU',
  'hsl(60, 7%, 8%)',
  'Norges Geologiske Undersøkelse',
  'https://www.ngu.no'
)

io.writeJson(config.datafil.organisasjon, db)
