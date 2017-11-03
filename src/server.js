const express = require('express')
const path = require('path')
const app = express()

app.use(express.static(path.join(__dirname, '../dist')))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.listen(3000, function () {
  console.log('TrustPool server listening on port 3000!')
})
