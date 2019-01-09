import { add as exempt } from '../../../utils/exemptions'

const bind = (route, config) => {
  require('./auth')(route, config)
  require('./player')(route, config)
  require('./transaction')(route, config)
  require('./game')(route, config)
  require('./master')(route, config)
}

exempt('/')

module.exports = { bind }
