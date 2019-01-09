import http from 'http'
import errors from 'restify-errors'
import errorsHelper from 'restify-errors/lib/helpers'
import localization from './locale.zh.json'
import log from '../logger'

function normalize(name) {
  if (!name.endsWith('Error')) {
    return `${name}Error`
  }
  return name
}

errors.localization = localization

errors.lang = (error) => {
  if (error.message) return error.message
  const name = error.name.slice(0, -5)
  return errors.localization[name]
}

errors.register = (options) => {
  Object.keys(options).forEach((name) => {
    const config = options[name]
    const errorName = normalize(name)
    if (errors[errorName]) {
      log.warn(`Duplicated Error: ${name}(${config.statusCode || config})`)
      return // duplicated
    }
    switch (typeof config) {
      case 'number':
        if (config % 1 === 0) {
          errors.makeConstructor(errorName, {
            statusCode: config,
          })
          return
        }
        break
      case 'object':
        errors.makeConstructor(errorName, config)
        return
      default:
    }
    throw new Error(`Invalid error config for ${errorName}`)
  })
}

errors.findHttpError = (status) => {
  const desc = http.STATUS_CODES[status]
  if (desc) {
    const name = errorsHelper.errNameFromDesc(desc)
    return errors[name]
  }
  return Error
}

errors.format = (err) => {
  let error = {}
  let statusCode = 500
  let restCode = 0
  if (typeof err === 'string') {
    const e = new errors.InternalError()
    error.code = 'InternalError'
    error.message = `${errors.lang(e)} (${err})` || e.name
  } else if (err.failedValidation) {
    statusCode = 400
    error = err
  } else {
    error.code = err.name
    restCode = err.restCode
    error.message = errors.lang(err) || err.name
    statusCode = err.statusCode || statusCode
  }
  return { statusCode, restCode, error }
}

module.exports = errors
