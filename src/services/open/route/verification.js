const { validate, getSchema, T } = require('../../../validator')
const Verification = require('../../../schema/open/verification')

const SCHEMA = {
  merchant_code: T.string()
    .regex(/^[a-zA-Z0-9_]+$/)
    .min(6)
    .max(50)
    .required(),
  country_code: T.string()
    .max(5)
    .required(),
  mobile: T.string()
    .regex(/^[0-9]+$/)
    .required(),
  locale: T.string()
    .valid('en', 'zh-cn')
    .default('en'),
  sign: T.string().required(),
  verification_code: T.string().required()
}

module.exports = route => {
  const sendVerificationCode = async (req, res, next) => {
    try {
      const postData = validate(
        req.body,
        getSchema(SCHEMA, 'merchant_code', 'country_code', 'mobile', 'locale', 'sign')
      )
      await Verification.sendVerifyCode(postData)
      return res.json({ success: true, code: 0 })
    } catch (err) {
      return next(err)
    }
  }

  const checkVerificationCode = async (req, res, next) => {
    try {
      const postData = validate(
        req.body,
        getSchema(SCHEMA, 'merchant_code', 'country_code', 'mobile', 'verification_code', 'sign')
      )
      const lucky_draw = await Verification.checkVerifyCode(postData)
      return res.json({ success: true, code: 0, detail: { lucky_draw } })
    } catch (err) {
      return next(err)
    }
  }

  route.post('/send_verification_code', sendVerificationCode)
  route.post('/check_verification_code', checkVerificationCode)
}
