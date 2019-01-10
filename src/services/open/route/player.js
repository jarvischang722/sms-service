import { validate, getSchema, T } from '../../../validator'
import Player from '../../../schema/open/player'
import { ROLE, CURRENCY } from '../../../schema/metadata/const'
import errors from '../../../error'

const SCHEMA = {
  merchant_code: T.string().regex(/^[a-zA-Z0-9_]+$/).min(6).max(50)
    .required(),
  auth_token: T.string().length(32).required(),
  game_platform_id: T.string().valid('2000').required(),
  sign: T.string().required(),
  username: T.string().regex(/^[a-zA-Z0-9_-]+$/).min(6).max(100)
    .required(),
  password: T.string().regex(/^[a-zA-Z0-9]+$/).min(6).max(20)
    .required(),
  realname: T.string().max(100).required(),
  extra: T.object().keys({
    language: T.string(),
    country: T.string(),
    email: T.string().email(),
    rebate: T.number().min(0).max(1),
    bonus: T.number().integer().min(1000).max(1999),
    currency: T.string().valid(CURRENCY),
    role: T.number().integer().valid([2, 3]),
    parent: T.string().regex(/^[a-zA-Z0-9_-]+$/).min(6).max(100),
  }),
  launcher_settings: T.object().keys(null),
  settings: T.object().keys(null),
  bet_limit: T.object().keys({
    min: T.number().min(0).default(0),
    max: T.number().greater(T.ref('min')),
  }),
  config: T.object().keys(null),
}

module.exports = (route, config) => {
  const exePlayerFunc = async (merchant, data, res, next, func, ...info) => {
    try {
      validate(data, getSchema(SCHEMA, 'merchant_code', 'auth_token', 'sign', 'game_platform_id', 'username', ...info))
      const { username } = data
      const infoData = info.map(key => data[key])
      const result = await Player[func](merchant.id, username, ...infoData)
      if (!result) {
        throw new errors.InvalidUsernameError()
      }
      return res.json({
        success: true,
        code: 0,
        detail: result,
      })
    } catch (err) {
      if (err) {
        if (err.message && err.message.includes('ER_DUP_ENTRY')) {
          return next(new errors.DuplicateUsernameError())
        }
      }
      return next(err)
    }
  }

  const createPlayer = async (req, res, next) => {
    if (req.merchant.role !== ROLE.AGENT) throw new errors.PermissionDeniedError()
    await exePlayerFunc(req.merchant, req.body, res, next, 'createPlayer', 'password', 'realname', 'extra')
  }

  const queryPlayer = async (req, res, next) => {
    await exePlayerFunc(req.merchant, req.query, res, next, 'queryPlayer')
  }

  const updatePlayer = async (req, res, next) => {
    if (req.merchant.role !== ROLE.AGENT) throw new errors.PermissionDeniedError()
    await exePlayerFunc(req.merchant, req.body, res, next, 'updatePlayer', 'realname', 'extra')
  }

  const queryGameLauncher = async (req, res, next) => {
    if (req.query) req.query.config = config
    await exePlayerFunc(req.merchant, req.query, res, next, 'queryGameLauncher', 'config', 'launcher_settings')
  }

  const playerExists = async (req, res, next) => {
    await exePlayerFunc(req.merchant, req.query, res, next, 'playerExists')
  }

  const updatePassword = async (req, res, next) => {
    if (req.merchant.role !== ROLE.AGENT) throw new errors.PermissionDeniedError()
    await exePlayerFunc(req.merchant, req.body, res, next, 'updatePassword', 'password')
  }

  const blockPlayer = async (req, res, next) => {
    if (req.merchant.role !== ROLE.AGENT) throw new errors.PermissionDeniedError()
    await exePlayerFunc(req.merchant, req.body, res, next, 'blockPlayer')
  }

  const unblockPlayer = async (req, res, next) => {
    if (req.merchant.role !== ROLE.AGENT) throw new errors.PermissionDeniedError()
    await exePlayerFunc(req.merchant, req.body, res, next, 'unblockPlayer')
  }

  const queryBlockStatus = async (req, res, next) => {
    await exePlayerFunc(req.merchant, req.query, res, next, 'queryBlockStatus')
  }

  const queryGameSettings = async (req, res, next) => {
    await exePlayerFunc(req.merchant, req.query, res, next, 'queryGameSettings')
  }

  const updateGameSettings = async (req, res, next) => {
    if (req.merchant.role !== ROLE.AGENT) throw new errors.PermissionDeniedError()
    await exePlayerFunc(req.merchant, req.body, res, next, 'updateGameSettings', 'settings')
  }

  const queryBetLimit = async (req, res, next) => {
    await exePlayerFunc(req.merchant, req.query, res, next, 'queryBetLimit')
  }

  const updateBetLimit = async (req, res, next) => {
    if (req.merchant.role !== ROLE.AGENT) throw new errors.PermissionDeniedError()
    await exePlayerFunc(req.merchant, req.body, res, next, 'updateBetLimit', 'bet_limit')
  }

  route.post('/create_player_account', createPlayer)
  route.get('/is_player_account_exist', playerExists)
  route.get('/query_player_account', queryPlayer)
  route.post('/update_player_account', updatePlayer)
  route.post('/change_player_password', updatePassword)
  route.post('/block_player_account', blockPlayer)
  route.post('/unblock_player_account', unblockPlayer)
  route.get('/query_player_block_status', queryBlockStatus)
  route.get('/query_game_launcher', queryGameLauncher)
  route.get('/query_player_game_settings', queryGameSettings)
  route.post('/update_player_game_settings', updateGameSettings)
  route.get('/query_player_bet_limit', queryBetLimit)
  route.post('/update_player_bet_limit', updateBetLimit)
}
