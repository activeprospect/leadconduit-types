{spawn, exec} = require 'child_process'
fs = require 'fs'
log = console.log

task 'publish', ->
  cmd = [
    'cake build',
    'rm -f leadconduit-*.tgz',
    'npm pack | tail -1 | xargs -I {} curl -F package=@{} https://push.fury.io/eceeTmQDMBbJF5DMujxy/activeprospect'
  ]
  run cmd.join(' && ')

task 'build', ->
  coffeePath = './node_modules/coffee-script/bin/coffee'
  if fs.existsSync(coffeePath)
    run "#{coffeePath} -o lib -c src"
  else
    console.log('> skipping build because coffee-script is not installed')

task 'test', ->
  run './node_modules/.bin/mocha spec/* --compilers coffee:coffee-script/register --reporter spec --colors'

task 'clean', ->
  run 'rm -fr ./lib'

run = (command) ->
  cmd = spawn '/bin/sh', ['-c', command]
  cmd.stdout.on 'data', (data) ->
    process.stdout.write data
  cmd.stderr.on 'data', (data) ->
    process.stderr.write data
  process.on 'SIGHUP', ->
    cmd.kill()
  cmd.on 'exit', (code) ->
    process.exit(code)