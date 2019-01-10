const chai = require('chai')
const charAsPromised = require('chai-as-promised')
const getServer = require('./lib/server')

/* eslint-disable no-underscore-dangle */
global.__DEV__ = true
global.__TEST__ = true

chai.use(charAsPromised)

/* eslint-disable no-undef */
/* eslint-disable func-names */
before(async function () {
  this.timeout(10000)
  global.should = chai.should()
  await getServer()
  global.env = {}
})

after(done => {
  done()
})
