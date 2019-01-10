const Joi = require('joi')
const errors = require('../error')

const validate = (data, sch, ext) => {
  let schema = typeof sch === 'object' ? Joi.object(sch) : sch
  if (ext) {
    let extra
    if (Array.isArray(ext)) {
      const required = {}
      /* eslint-disable no-restricted-syntax */
      for (const r of ext) {
        required[r] = Joi.required()
      }
      extra = Joi.object(required)
    } else if (typeof ext === 'object') {
      extra = Joi.object(ext)
    }
    schema = schema.concat(extra)
  }
  const result = Joi.validate(data, schema)
  if (result.error) {
    throw new errors.ValidationFailedError(result.error.details[0])
  }
  if (result.value && Object.keys(data).length > 0) {
    for (const key of Object.keys(data)) {
      if (result.value[key]) {
        data[key] = result.value[key]
      }
    }
  }
  return result.value
}

const getSchema = (schema, ...keys) => {
  const schemaKeys = []
  for (const key of keys) {
    if (Array.isArray(key)) {
      schemaKeys.push(...key)
    } else {
      schemaKeys.push(key)
    }
  }
  const sub = {}
  for (const key of schemaKeys) {
    sub[key] = schema[key]
  }
  return sub
}

module.exports = { validate, getSchema, T: Joi }
