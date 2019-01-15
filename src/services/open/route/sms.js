const { validate, getSchema, T } = require('../../../validator')
const SMS = require('../../../sms')

const SCHEMA = {
  merchant_code: T.string().regex(/^[a-zA-Z0-9_]+$/).min(6).max(50)
    .required(),
  mobile_list: T.string().regex(/^[0-9,]+$/).required(),
  content: T.string().required(),
  sign: T.string().required(),
}

module.exports = (route) => {
  const sendGroupSms = async (req, res, next) => {
    try {
      validate(req.body, getSchema(SCHEMA, 'merchant_code', 'mobile_list', 'content', 'sign'))
      const { mobile_list, content } = req.body
      const sent_mobile_list = await SMS.sendGroup(mobile_list, content)
      return res.json({
        success: true,
        code: 0,
        detail: {
          sent_mobile_list
        }
      })
    } catch (err) {
      return next(err)
    }
  }

  route.post('/send_group_sms', sendGroupSms)
}
