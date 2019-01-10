// import { add as exempt } from '../../../utils/exemptions'
const { add: exempt } = require('../../../utils/exemptions')

const bind = (route, config) => {}

exempt('/')

module.exports = { bind }
