const { add: exempt } = require('../../../utils/exemptions')

const bind = (route, config) => {
  require('./verification')(route, config, exempt)
  require('./draw')(route, config, exempt)
  require('./sms')(route, config, exempt)
}

exempt('/')

module.exports = { bind }
