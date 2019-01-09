import express from 'express'
import bodyParser from 'body-parser'
// import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import config from './config'
import route from './route'
import errors from '../../error'
import authorization from './authorization'
import log from '../../logger'
import pjson from '../../../package.json'

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
      if (err.message && err.message.includes('"merchant_code"')) newErr = new errors.InvalidMerchantCodeError()
    }
    const { statusCode, restCode: code, error } = errors.format(newErr)
    res.status(statusCode).send({
      code,
      success: false,
      message: error.message,
      error
    })
  })

  app.get('/', (req, res) => { res.send(`Tripleonetech SMS open api service ${pjson.version}`) })
  app.use('/sms/openapi', apiRouter)

  /* eslint-disable no-underscore-dangle */
  if (__TEST__) return app

  let port = config.server.port
  if (instance) port += +instance

  return app.listen(port, () => {
    log.info(`The server [${config.name}] running on port: ${port}`)
  })
}

export default server
