const client = require('./lib/client')
const sign = require('../src/services/open/authorization/sign')

const apiPrefix = '/sms/openapi'

describe('Open API', () => {
  it('Get data', done => {
    env.admin = {
      merchant_code: 'xxxxxxx',
      country_code: '866',
      mobile: '0938891988',
      locale: 'en',
      sign_key: 'xxxxxxxxxxxx'
    }
    done()
  })
  it('Send Verification code', done => {
    const input = {
      merchant_code: env.admin.merchant_code,
      country_code: env.admin.country_code,
      mobile: env.admin.mobile,
      locale: env.admin.locale,
    }
    input.sign = sign(env.admin.sign_key, input)
    client('open')
      .post(`${apiPrefix}/send_verification_code`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(input)
      .expect(200)
      .end((err, res) => {
        should.not.exist(err)
        res.body.should.have.property('success').and.be.true
        res.body.should.have.property('code').and.equal('0')
        done()
      })
  })

  it('Check Verification code', done => {
    const input = {
      merchant_code: env.admin.merchant_code,
      country_code: env.admin.country_code,
      mobile: env.admin.mobile,
      verification_code: 'xxxxxxxx'
    }
    input.sign = sign(env.admin.sign_key, input)
    client('open')
      .post(`${apiPrefix}/check_verification_code`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(input)
      .expect(200)
      .end((err, res) => {
        should.not.exist(err)
        res.body.should.have.property('success').and.be.true
        res.body.should.have.property('code').and.equal('0')
        done()
      })
  })
})
