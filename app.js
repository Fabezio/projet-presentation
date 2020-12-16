const express = require('express')
const app = express()
const mongoose = require('mongoose')
const parser = require('body-parser')
const flash = require('connect-flash')
const path = require('path')
const pug = require('pug')

const User = require('./models/User')

mongoose.connect(
  'mongodb://localhost/presentation',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  },
  () => {
    console.log('db found')
  }
)

const PORT = 3000 || 8080

app
  .set('view engine', path.join(__dirname, 'views'))
  .set('view engine', 'pug')
  .use(express.static('public'))
  .get('/', (req, res) => {
    User.find({}, (err, found) => {
      err ? console.log(err) : res.render('index', { users: found })
    })
  })

  .get('/manifest.json', (req, res) => {
    res.header('Content-Type', 'text/cache-manifest')
    res.sendFile(path.join(__dirname, 'manifest.json'))
  })
  .get('/sw.js', (req, res) => {
    res.header('Content-Type', 'text/javascript')
    res.sendFile(path.join(__dirname, 'sw.js'))
  })
  .get('/loader.js', (req, res) => {
    res.header('Content-Type', 'text/javascript')
    res.sendFile(path.join(__dirname, 'loader.js'))
  })
  .listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
  })
