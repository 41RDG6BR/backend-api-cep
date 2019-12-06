const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport')
const session = require("express-session")


require('dotenv').config()

const middlewares = require('./middlewares')
const api = require('./api')

const app = express()

app.use(session({ secret: "hjadoijasdoisajd" }));
app.use(passport.initialize())
app.use(passport.session())
app.use(cors( {
  credentials: true,
  origin: 'http://localhost:3000',
}))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
  res.json({
    message: '🌎🌍🌏',
  })
})

app.use('/users', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
