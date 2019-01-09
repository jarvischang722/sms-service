import { validate, getSchema, T } from '../../../validator'
import Transaction from '../../../schema/open/transaction'
import errors from '../../../error'
import Player from '../../../schema/open/player'
import { ROLE, TRANSACTION_TYPE } from '../../../schema/metadata/const'

const SCHEMA = {
  merchant_code: T.string().regex(/^[a-zA-Z0-9_]+$/).min(6).max(50)
    .required(),
  auth_token: T.string().length(32).required(),
  game_platform_id: T.string().valid('2000').required(),
  sign: T.string().required(),
  username: T.string().required(),
  action_type: T.string().valid('deposit', 'withdraw').required(),
  amount: T.number().greater(0),
  external_trans_id: T.string().max(64),
  page_number: T.number().integer().min(1).default(1),
}

module.exports = (route) => {
  const transferPlayerFund = async (req, res, next) => {
    try {
      if (req.merchant.role !== ROLE.AGENT) throw new errors.PermissionDeniedError()
      validate(req.body, getSchema(SCHEMA, 'merchant_code', 'auth_token', 'sign', 'game_platform_id', 'username', 'action_type', 'amount', 'external_trans_id'))
      const { username, action_type, amount, external_trans_id } = req.body
      const player = await Player.getPlayer(req.merchant.id, username)
      const trans_type = action_type === 'deposit' ?
        TRANSACTION_TYPE.TRANSFER_IN :
        TRANSACTION_TYPE.TRANSFER_OUT
      const { transaction_id, updated } = await Transaction.transferPlayerFund(
        req.merchant.id, player.id, trans_type, amount, external_trans_id
      )
      return res.json({
        success: true,
        code: 0,
        detail: { transaction_id, updated },
      })
    } catch (err) {
      if (err) {
        if (err.message && err.message.includes('ER_DUP_ENTRY')) {
          return next(new errors.DuplicateExternalTransIdError())
        }
      }
      return next(err)
    }
  }

  const queryTransaction = async (req, res, next) => {
    try {
      validate(req.query, getSchema(SCHEMA, 'merchant_code', 'auth_token', 'sign', 'game_platform_id', 'external_trans_id'))
      const { external_trans_id } = req.query
      const results = await Transaction.queryTransaction(req.merchant.id, external_trans_id)
      if (!results) {
        throw new errors.InvalidExternalTransIdError()
      }
      return res.json({
        success: true,
        code: 0,
        detail: results,
      })
    } catch (err) {
      return next(err)
    }
  }

  const queryTransactionHistory = async (req, res, next) => {
    try {
      const v = validate(req.query, getSchema(SCHEMA, 'merchant_code', 'auth_token', 'sign', 'game_platform_id', 'page_number'))
      const { page_number: page } = v
      const pagesize = 3000
      const result = await Transaction.queryTransactionHistory(req.merchant.id, page, pagesize)
      const detail = {
        total_pages: Math.ceil(result.total / pagesize),
        current_page: page,
        total_rows_current_page: result.items ? result.items.length : 0,
        transaction_history: result.items || [],
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

  const queryPlayerBalance = async (req, res, next) => {
    try {
      validate(req.query, getSchema(SCHEMA, 'merchant_code', 'auth_token', 'sign', 'game_platform_id', 'username'))
      const { username } = req.query
      const results = await Transaction.queryPlayerBalance(req.merchant.company, username)
      return res.json({
        success: true,
        code: 0,
        detail: results,
      })
    } catch (err) {
      return next(err)
    }
  }

  route.post('/transfer_player_fund', transferPlayerFund)
  route.get('/query_transaction', queryTransaction)
  route.get('/query_transaction_history', queryTransactionHistory)
  route.get('/query_player_balance', queryPlayerBalance)
}
