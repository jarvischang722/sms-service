
const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const config = require('./config')
const route = require('./route')
const errors = require('../../error')
const authorization = require('./authorization')
// const log = require('../../logger')
const pjson = require('../../../package.json')

const instance = process.env.NODE_APP_INSTANCE

const server = async () => {
  const app = express()

  app.use(helmet())

  const apiRouter = new express.Router()

  apiRouter.use(bodyParser.urlencoded({ extended: false }))
  apiRouter.use(bodyParser.json())
  apiRouter.use(authorization.authorize(config))

  route.bind(apiRouter, config)

  /* eslint-disable no-unused-vars */
  apiRouter.use((err, req, res, next) => {
    let newErr = err
    if (err && err.code === 'ValidationFailed') {
      if (err.message && err.message.includes('"sign"')) newErr = new errors.InvalidSignatureError()
      if (err.message && err.message.includes('"merchant_code"')) { newErr = new errors.InvalidMerchantCodeError() }
    }
    const { statusCode, restCode: code, error } = errors.format(newErr)
    res.status(statusCode).send({
      code,
      success: false,
      message: error.message,
      error
    })
  })

  app.get('/', (req, res) => {
    res.send(`Tripleonetech SMS open api service ${pjson.version}`)
  })
  app.use('/sms/openapi', apiRouter)

  /* eslint-disable no-underscore-dangle */
  // if (__TEST__) return app

  let port = config.server.port
  if (instance) port += +instance

  return app.listen(port, () => {
    console.log(`The server [${config.name}] running on port: ${port}`)
  })
}

module.exports = server
