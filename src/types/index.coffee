fs = require('fs')
path = require('path')

index = /^index/

for file in fs.readdirSync __dirname
  continue if file.match(index)
  Ctor = require("./#{path.basename(file, path.extname(file))}")
  module.exports[Ctor.name] = Ctor


