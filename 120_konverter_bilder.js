const io = require('./lib/io')
const config = require('./config')
const log = require('./lib/log')
const path = require('path')
const { spawnSync } = require('child_process')

function convertSync(kildesti, målsti, format, maxWidth, maxHeight = '') {
  const max = Math.min(maxWidth, maxHeight)
  const args = [
    '-resize',
    maxWidth + 'x' + maxHeight,
    '-background',
    'transparent',
    //    '-format',
    //    format,
    '-density',
    '600',
    //    '-verbose',
    '-debug',
    'user',
    '-path',
    målsti,
    kildesti
  ]
  const r = spawnSync('mogrify', args)
  log.d(r.output.toString())
  if (r.status > 0) throw new Error(r.error.toString())
}

function konverterAlle(kildesti, målsti, format, maxWidth, maxHeight) {
  const files = io.findFiles(kildesti, '.' + format)
  console.log('found ' + files.length + ' files..')
  for (var kildefil of files) {
    const målfil = `${målsti}/kode/${maxWidth}/`
    const målfil2 = `${målsti}/kode/${maxWidth}/${
      path.parse(kildefil).name
    }.${format}`
    console.log(målfil)
    convertSync(kildefil, målfil, format, maxWidth, maxHeight)
  }
}

konverterAlle(config.imagePath.source, config.imagePath.processed, 'jpg', 408, 297)
konverterAlle(
  config.imagePath.source,
  config.imagePath.processed,
  'png',
  40,
  40
)
