const { validate, getSchema, T } = require('../../../validator')

const SCHEMA = {
  merchant_code: T.string().regex(/^[a-zA-Z0-9_]+$/).min(6).max(50)
    .required(),
  country_code: T.string().max(5).required(),
  mobile: T.string().regex(/^[0-9]+$/).required(),
  lucky_draw: T.string().min(8).max(8).required()
}

module.exports = (route) => {
  const queryLuckyDraw = async (req, res, next) => {
    try {
      validate(req.body, getSchema(SCHEMA, 'merchant_code', 'country_code', 'mobile', 'sign'))
      return res.json({
        success: true,
        code: 0
      })
    } catch (err) {
      return next(err)
    }
  }

  const queryIsWinning = async (req, res, next) => {
    try {
      validate(req.body, getSchema(SCHEMA, 'merchant_code', 'country_code', 'mobile', 'lucky_draw', 'sign'))
      return res.json({
        success: true,
        code: 0
      })
    } catch (err) {
      return next(err)
    }
  }

  route.get('/query_lucky_draw', queryLuckyDraw)
  route.get('/query_is_winning', queryIsWinning)
}
