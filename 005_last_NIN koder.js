const { downloadJson2File } = require('./lib/io')
const config = require('./config')

// Laster ned NiN koder fra obsolete kodetjeneste og lagrer lokalt
// TODO: Last data fra kildedata (Excel-ark?)

// NA - Natursystem
downloadJson2File(config.datakilde.nin_koder, config.datafil.nin_koder)

//BS,MI - Beskrivelsessystem og miljøvariabler
downloadJson2File(config.datakilde.nin_variasjon, config.datafil.nin_variasjon)
