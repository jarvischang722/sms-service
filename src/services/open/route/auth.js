const { generateOpenToken } = require('../../../schema/open/auth')
const { validate, T } = require('../../../validator')

const SCHEMA = {
  merchant_code: T.string().regex(/^[a-zA-Z0-9_]+$/).min(6).max(50)
    .required(),
  secure_key: T.string().length(32).required(),
  sign: T.string().required(),
}

module.exports = (route) => {
  const generateToken = async (req, res, next) => {
    try {
      validate(req.body, SCHEMA)
      const result = await generateOpenToken(req.merchant.id)
      return res.json({
        success: true,
        code: 0,
        detail: result,
      })
    } catch (err) {
      return next(err)
    }
  }

  route.post('/generate_token', generateToken)
}
