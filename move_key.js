const fs = require('fs')
const path = require('path')
const {
  kodkode,
  splittKode,
  lookup,
  lookupWithCreate,
  lookupBarn
} = require('./lib/koder')

function readJson(filePath) {
  const data = fs.readFileSync(filePath)
  return (json = JSON.parse(data))
}

let db = readJson('../input/v2.json')

function moveKey(srcKey, targetParentKey) {
  let parent = lookup(targetParentKey)
  let children = lookupBarn(db, srcKey)
  children.forEach(c => {
    const srcChildKey = srcKey + '/' + c + '/C'
    const destParentKode = targetParentKey + '_' + srcKey + c + '-C'
    const destChildKode = targetParentKey + '_' + srcKey + c
    let myChild = lookup(db, srcChildKey)
    const parentKode = 'NA_' + srcChildKey
    Object.keys(myChild).forEach(key => {
      let child = myChild[key]
      delete child.forelder
      if (key === '@') child.forelder2 = { kode: destChildKode }
      else {
        child['@'].forelder = { kode: destParentKode }
        console.log(child['@'].kode, child['@'].forelder)
      }
    })

    let dest = lookup(db, parentKode)
    if (dest) throw new Error('Already a key at target')
    dest = lookupWithCreate(db, parentKode)
    console.log(dest)
    //    console.log(myChild['@'].kode, targetKey)
  })
  //  console.log(children)
}

moveKey('L', 'NA')
//moveKey('T', 'NA')
//moveKey('V', 'NA')

fs.writeFileSync('nydb.json', JSON.stringify(db))

/*

NA_T1-E1-C1-1
NA_T1-E-1
NA_T1-C-1
NA_T1-1

*/