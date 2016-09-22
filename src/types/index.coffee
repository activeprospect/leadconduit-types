fs = require('fs')
path = require('path')

index = /^index/

for file in fs.readdirSync __dirname
  continue if file.match(index)
  fileName = path.basename(file, path.extname(file))
  if fileName == 'string'
    module.exports.String = require('./string')
  else
    Ctor = require("./#{fileName}")
    module.exports[Ctor.name] = Ctor


