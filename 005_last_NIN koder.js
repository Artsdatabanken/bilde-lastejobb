const { downloadJson2File } = require('./lib/io')
const config = require('./config')

downloadJson2File(config.datakilde.nin_koder, config.datafil.nin_koder)
downloadJson2File(config.datakilde.nin_variasjon, config.datafil.nin_variasjon)
