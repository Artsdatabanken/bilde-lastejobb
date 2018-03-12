const io = require('./lib/io')
const config = require('./config')
const log = require('./lib/log')
const path = require('path')
const { spawnSync } = require('child_process')

function convertSync(kildesti, målsti, format, width, height = '') {
  log.v('converting', kildesti, ' to ', width, 'x', height, ' in ', format)
  const max = Math.min(width, height)
  const args = [
    '-resize',
    width + 'x' + height + '^',
    '-gravity',
    'center',
    '+repage',
    '-crop',
    width + 'x' + height + '+0+0',
    '-background',
    'transparent',
    '-format',
    format,
    '-density',
    '600',
    //    '-verbose',
    '-debug',
    'user',
    '-path',
    målsti,
    kildesti
  ]
  //  console.log(args.join(' '))
  //  throw new Error()
  const r = spawnSync('mogrify', args)
  log.d(r.output.toString())
  if (r.status > 0) throw new Error(r.stderr.toString())
}

function konverterAlle(kildesti, målsti, maxWidth, maxHeight) {
  const files = io.findFiles(kildesti)
  console.log('Found ' + files.length + ' files..')
  for (var kildefil of files) {
    const kildePath = path.parse(kildefil)
    const format = '.svg.png'.indexOf(kildePath.ext) >= 0 ? 'png' : 'jpg'
    const målstiwidth = `${målsti}/${maxWidth}`
    const målfil = `${målstiwidth}/${kildePath.name}.${format}`
    if (io.fileExists(målfil)) log.v('skip', målfil)
    else convertSync(kildefil, målstiwidth, format, maxWidth, maxHeight)
  }
}

konverterAlle(
  config.imagePath.source,
  config.imagePath.processed + '/kode',
  408,
  297
)
if (false)
  konverterAlle(
    config.imagePath.source,
    config.imagePath.processed + '/kode',
    40,
    40
  )
