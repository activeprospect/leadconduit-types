{spawn, exec} = require 'child_process'
fs = require 'fs'
log = console.log

task 'build', ->
  coffeePath = './node_modules/coffee-script/bin/coffee'
  if fs.existsSync(coffeePath)
    run "#{coffeePath} -o lib -c src"
  else
    console.log('> skipping build because coffee-script is not installed')

option '-p', '--path [DIR]', 'path to test file'
task 'test', (options) ->
  file = options.path or ''
  pattern = "spec/**/#{file}*-spec.coffee"
  console.log("\nRunning tests at #{pattern}...")
  run "export TZ=GMT; ./node_modules/.bin/mocha \"#{pattern}\" --compilers coffee:coffee-script/register --reporter spec --colors"

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
