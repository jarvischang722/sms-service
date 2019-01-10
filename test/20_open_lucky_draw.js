const client = require('./lib/client')
const querystring = require('querystring')
const sign = require('../src/services/open/authorization/sign')

const apiPrefix = '/sms/openapi'

describe('Open API', () => {
  it('Query lucky draw', done => {
    const input = {
      merchant_code: env.admin.merchant_code,
      country_code: env.admin.country_code,
      mobile: env.admin.mobile
    }
    input.sign = sign(env.admin.sign_key, input)
    client('open')
      .get(`${apiPrefix}/query_lucky_draw?${querystring.stringify(input)}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        should.not.exist(err)
        res.body.should.have.property('success').and.be.true
        res.body.should.have.property('code').and.equal('0')
        res.body.should.have.property('detail')
        res.body.detail.should.have.property('lucky_draw')
        done()
      })
  })

  it('Query is winning', done => {
    const input = {
      merchant_code: env.admin.merchant_code,
      country_code: env.admin.country_code,
      mobile: env.admin.mobile,
      lucky_draw: 'xxxxxxxx'
    }
    input.sign = sign(env.admin.sign_key, input)
    client('open')
      .post(`${apiPrefix}/query_is_winning${querystring.stringify(input)}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        should.not.exist(err)
        res.body.should.have.property('success').and.be.true
        res.body.should.have.property('code').and.equal('0')
        done()
      })
  })
})
