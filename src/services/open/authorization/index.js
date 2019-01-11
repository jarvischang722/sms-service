const authSign = require('./sign')
const errors = require('../../../error')

const authorize = () => {
  const auth = async (req, res, next) => {
    try {
      const data = req.body && Object.keys(req.body).length > 0 ? req.body : req.query
      if (!data) return next(new errors.InvalidMerchantCodeError())
      const { merchant_code, sign } = data
      if (!merchant_code) return next(new errors.InvalidMerchantCodeError())
      const query = `
        SELECT
          id,
          code,
          sign_key,
        FROM merchant
        WHERE
          code = ?
        ;`
      const results = await db.query(query, [merchant_code])
      if (results.length <= 0) return next(new errors.InvalidMerchantCodeError())
      const row = results[0]

      // check signature
      const signature = authSign(row.sign_key, data)
      if (!signature || !sign || signature !== sign) return next(new errors.InvalidSignatureError())
      req.merchant = {
        id: row.id,
        code: merchant_code
      }
      return next()
    } catch (err) {
      return next(err)
    }
  }
  return auth
}

module.exports = { authorize }
