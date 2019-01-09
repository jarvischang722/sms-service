import redis from 'redis'
import mysql from 'promise-mysql'
import Promise from 'bluebird'
import { promisify } from 'util'
import DbManager from './manager'
import config from './config'
import log from '../logger'

const connections = {}

const query = (execQuery, params = []) =>
  Promise
    .using(connections.mysql.connect(), conn =>
      conn.query(execQuery, params)
    )
    .catch(err => {
      if (__DEV__ && !err.code) {
        err.data = execQuery
        log.error(err, false)
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
      if (__DEV__ && !err.code) {
        err.data = actions
        log.error(err, false)
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

const configureRedis = () => {
  if (connections.redis) {
    const cfg = connections.redis
    const client = redis.createClient(cfg)
    // 设定 error handler 以避免 redis 断线时造成 express crash
    // ref: https://github.com/NodeRedis/node_redis/issues/1300
    const throttles = [
      { code: 'ECONNREFUSED', limit: 1, cur: 0 }
    ]
    client.on('error', (err) => {
      const overLimit = throttles.find(throttle => {
        if (err.code === throttle.code) {
          throttle.cur++
          return throttle.cur > throttle.limit // 避免 admin 被洗信箱
        }
        return false
      })
      if (overLimit) return
      log.error(`redis: ${JSON.stringify(err)}`)
    })
    client.on('connect', () => { throttles.forEach(throttle => { throttle.cur = 0 }) })
    const getAsync = promisify(client.get).bind(client)
    const ttlAsync = promisify(client.ttl).bind(client)
    const delAsync = promisify(client.del).bind(client)
    const keysAsync = promisify(client.keys).bind(client)
    connections.redis = {
      config: cfg,
      client,
      getAsync,
      ttlAsync,
      delAsync,
      keysAsync,
    }
  } else {
    throw new Error('redis connection config not found')
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
  configureRedis()

  return new DbManager({ connections })
}

module.exports = { configure, query, transaction, connections }
