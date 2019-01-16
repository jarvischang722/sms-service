const log4js = require('log4js')

// Level :  TRACE < DEBUG < INFO < WARN < ERROR < FATAL < MARK
const levels = {
  trace: log4js.levels.TRACE,
  debug: log4js.levels.DEBUG,
  info: log4js.levels.INFO,
  warn: log4js.levels.WARN,
  error: log4js.levels.ERROR,
  fatal: log4js.levels.FATAL
}

const appenders = {
  stdout: {
    type: 'stdout'
  },
  file: {
    type: 'dateFile',
    filename: 'logs/',
    pattern: 'yyyy-MM-dd.log',
    maxLogSize: 10485760,
    backups: 5,
    compress: true,
    // 包含模型
    alwaysIncludePattern: true
  }
}

// 開發環境使用 stdout
/* eslint-disable no-underscore-dangle  */

const categories = {
  default: { appenders: ['stdout'], level: 'trace' },
  prod: { appenders: ['stdout', 'file'], level: 'info' }
}


log4js.configure({
  appenders,
  categories,
  pm2: true
})

const logType = global.__DEV__ === undefined || global.__DEV__ === false ? 'prod' : 'default'

module.exports = log4js.getLogger(logType)
