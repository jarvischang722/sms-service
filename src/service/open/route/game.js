import moment from 'moment-timezone'
import { validate, getSchema, T } from '../../../validator'
import Game from '../../../schema/open/game'
import { ZONE } from '../../../schema/metadata/const'

const SCHEMA = {
  merchant_code: T.string().regex(/^[a-zA-Z0-9_]+$/).min(6).max(50)
    .required(),
  auth_token: T.string().length(32).required(),
  game_platform_id: T.string().valid('2000').required(),
  sign: T.string().required(),
  from: T.date().required(),
  to: T.date().min(T.ref('from')).required(),
  time_type: T.number().integer().valid(1, 2).default(1),
  page_number: T.number().integer().min(1).default(1),
  username: T.string().regex(/^[a-zA-Z0-9_-]+$/).min(6).max(100),
  total_type: T.string().valid('minute', 'hourly', 'daily', 'monthly', 'weekly', 'yearly').required(),
}

module.exports = (route) => {
  const queryGameHistory = async (req, res, next) => {
    try {
      const { from, to, page_number: page, username, time_type } = validate(req.query, getSchema(
        SCHEMA, 'merchant_code', 'auth_token', 'sign', 'game_platform_id',
        'from', 'to', 'page_number', 'username', 'time_type'
      ))
      const pagesize = 3000
      const filter = {
        from: moment.tz(from, ZONE).valueOf() / 1000,
        to: moment.tz(to, ZONE).valueOf() / 1000,
        playerName: username,
        time_type,
      }
      const result = await Game.queryGameHistory(
        req.merchant, page, pagesize, filter
      )
      const detail = {
        total_pages: Math.ceil(result.total / pagesize),
        current_page: page,
        total_rows_current_page: result.items ? result.items.length : 0,
        game_history: result.items || []
      }
      return res.json({
        success: true,
        code: 0,
        detail,
      })
    } catch (err) {
      return next(err)
    }
  }

  route.get('/query_game_history', queryGameHistory)
}
