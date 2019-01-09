import authSign from './sign'
import errors from '../../../error'
import { getOpenToken } from '../../../schema/open/auth'
// import log from '../../../logger'

const authorize = () => {
  const auth = async (req, res, next) => {
    try {
      const data = req.body && Object.keys(req.body).length > 0 ? req.body : req.query
      if (!data) return next(new errors.InvalidMerchantCodeError())
      const { merchant_code, secure_key, auth_token, sign } = data
      if (!merchant_code) return next(new errors.InvalidMerchantCodeError())
      const query = `
        SELECT
          id,
          role,
          secure_key,
          sign_key,
          company_id,
          is_master
        FROM player
        WHERE
          merchant_code = ?
          AND (role = ? OR role = ?)
        ;`
      const results = await db.query(query, [merchant_code, ROLE.COMPANY, ROLE.AGENT])
      if (results.length <= 0) return next(new errors.InvalidMerchantCodeError())
      const row = results[0]
      // 只有generate token接口需要secure key, 不需要auth token
      let token
      let timeout
      if (req.url.toLowerCase().endsWith('/generate_token')) {
        // check secure key
        if (!secure_key || (row.secure_key !== secure_key)) {
          return next(new errors.InvalidSecureKeyError())
        }
      } else {
        if (secure_key) {
          return next(new errors.SecureKeyNotAllowedError())
        }
        // check auth token
        const openToken = await getOpenToken(row.id)
        if (openToken) {
          token = openToken.token
          timeout = openToken.ttl
        }
        if (!auth_token || !token || token !== auth_token || timeout <= 0) {
          return next(new errors.InvalidAuthTokenError())
        }
      }
      // check signature
      const signature = authSign(row.sign_key, data)
      if (!signature || !sign || signature !== sign) return next(new errors.InvalidSignatureError())
      req.merchant = {
        id: row.id,
        role: row.role,
        code: merchant_code,
        token,
        timeout,
        company: row.company_id,
        isMaster: row.is_master || row.role === ROLE.COMPANY,
      }
      return next()
    } catch (err) {
      return next(err)
    }
  }
  return auth
}

module.exports = { authorize }
