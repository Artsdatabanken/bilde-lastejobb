const path = require('path')
const io = require('./lib/io')
const config = require('./config')
const log = require('./lib/log')

const record = io.readCsv(config.datakilde.taxon_adb_photos)
const taxons = io.readJson(config.datafil.taxon_50).data
const sciNameId2Name = {}
Object.keys(taxons).forEach(key => {
  const t = taxons[key]
  sciNameId2Name[t.navnSciId] = t.tittel.la
})

async function downloadFile(url, targetFile) {
  await io.getBinaryFromCache(url, targetFile)
}

async function download(x) {
  const mediaId = x.file_id
  const filename = x.filename
  const fileExtension = path.extname(filename)
  const scientificNameId = parseInt(x.scientificNameId)
  const oldTag = 'TX_' + scientificNameId.toString(36).toUpperCase()
  const sciName = sciNameId2Name[scientificNameId]
  if (!sciName) log.w('Finner ikke sciNameId #' + x.scientificNameId)
  else {
    const kode =
      config.prefix.taxon + sciNameId2Name[scientificNameId].replace(' ', '_')
    const url = `https://www.artsdatabanken.no/Media/F${mediaId}`
    const targetFile = config.imagePath.source + '/' + kode + fileExtension
    //    const fn = config.imagePath + '' + kode + fileExtension
    await downloadFile(url, targetFile)
    /*    console.log(
        `curl https://www.artsdatabanken.no/Media/F${mediaId} -o ${oldTag}${fileExtension}`
        //    `convert -resize x408 ../raw/${tag}.jpg ${tag}.jpg`
        //`convert -resize x40 ../raw/${tag}.jpg ${tag}.png`
      )*/
  }
}

async function downThemAll() {
  for (let i = 0; i < record.length; i++) await download(record[i])
}

downThemAll().then(x => log.i(x))
