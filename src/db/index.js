const mysql = require('promise-mysql')
const Promise = require('bluebird')
const DbManager = require('./manager')
const config = require('./config')
const log = require('../logger')

const connections = {}

const query = (execQuery, params = []) =>
  Promise
    .using(connections.mysql.connect(), conn =>
      conn.query(execQuery, params)
    )
    .catch(err => {
      if (!err.code) {
        err.data = execQuery
        console.error(err, false)
        delete err.data
      }
      throw err
    })

const transaction = (actions) =>
  Promise
    .using(connections.mysql.connect(), conn =>
      conn.beginTransaction()
        .then(() => actions(conn))
        .then(result => conn.commit().then(() => result))
        .catch(err => conn.rollback().then(() => { throw err }))
    )
    .catch(err => {
      if (!err.code) {
        err.data = actions
        console.error(err, false)
        delete err.data
      }
      throw err
    })

const configureMySql = () => {
  if (connections.mysql) {
    const cfg = connections.mysql
    const pool = mysql.createPool(cfg)
    const connect = () =>
      pool.getConnection().disposer(connection => {
        pool.releaseConnection(connection)
      })
    connections.mysql = {
      config: cfg,
      connect
    }
  } else {
    throw new Error('mysql connection config not found')
  }
}

const configure = () => {
  Object.keys(config).forEach(key => {
    const dbCfg = config[key]
    const conn = {
      host: dbCfg.host,
      port: dbCfg.port,
    }
    if (dbCfg.db) conn.database = dbCfg.db
    if (dbCfg.credentials) {
      conn.user = dbCfg.credentials.username
      conn.password = dbCfg.credentials.password
    }
    switch (key) {
      case 'mysql':
        conn.multipleStatements = true
        break
      default:
        break
    }
    connections[key] = conn
  })

  configureMySql()

  return new DbManager({ connections })
}

module.exports = { configure, query, transaction, connections }
