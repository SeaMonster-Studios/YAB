const jsonServer = require('json-server')
const fs = require('fs')
const path = require('path')

const db = require('./dbFakers.js')()
const jsonFiles = fs.readdirSync(__dirname)

jsonFiles.forEach(file => {
  if (path.extname(__dirname + file) === '.json') {
    db[path.basename(file, '.json')] = require(path.join(__dirname, file))
  }
})

const server = jsonServer.create()
server.use(jsonServer.defaults())

const router = jsonServer.router(db)
server.use(router)

server.listen(5005, () => {
  console.log('JSON Server is running')
})
