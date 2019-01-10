const supertest = require('supertest')

module.exports = (service) => {
  const client = supertest(global.services[service])
  return client
}
