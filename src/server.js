/* eslint-disable no-underscore-dangle */
global.__DEV__ = process.env.NODE_ENV === 'dev'
global.__TEST__ = process.env.NODE_ENV === 'test'

const openService = require('./services/open')
const Cron = require('./cron')
const db = require('./db')
const log = require('./logger')
// const errors = require('./error')
require('./error/register-errors')

global.db = db

const server = async () => {
  /** ********************
   *  Update db to latest
   *  db connection
  ************************ */
  const dbManager = db.configure()
  await dbManager.update()
  log.info(`db version: ${dbManager.version}`)

  /** ********************
   *  Start Server
  ************************ */
  const app = {}

  app.open = await openService()
  //  app.services.backoffice = await backofficeService()

  global.services = app


  /** ****************
   * Run cron
   **************** */
  Cron.run()
}


module.exports = () => {
  const handleErr = (e) => {
    log.error(e)
    throw e
  }
  return server().catch(handleErr)
}

