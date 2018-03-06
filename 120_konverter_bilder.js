const io = require('./lib/io')
const config = require('./config')
const log = require('./lib/log')
const path = require('path')
const { execFile } = require('child_process')

async function convertAll() {
  const files = io.findFiles(config.imagePath.source, '.svg')
  log.e(files.length)
  for (var i = 0; i < files.length; i++) {
    const file = files[i]
    const r = await svg2png(file)
  }
}

function convert(kildesti, målsti, format, maxWidth, maxHeight = '') {
  //    const args = `-resize 408x408 -background transparent -format png -density 600 -path ..${målsti}/kode/${pixelSize} ${kildesti}`
  const args = [
    '-resize',
    maxWidth + 'x' + maxHeight,
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
    `${målsti}/kode/${pixelSize}/`,
    kildesti + '/*'
  ]
  console.log(args.join(' '))
  const child = execFile('mogrify', args)
  child.stdout.on('data', function(data) {
    console.log(data)
  })
  child.stderr.on('data', function(data) {
    console.log(data) // Normal output ends up here for some reason..
  })
  child.on('close', function(code) {
    console.log('#exit code: ' + code)
  })
}

convert(config.imagePath.source, config.imagePath.processed, 'png', 40, 40)
convert(config.imagePath.source, config.imagePath.processed, 'jpg', 408)
