const env = process.env.NODE_ENV

const config = require(`./${env}.json`)

module.exports = config
