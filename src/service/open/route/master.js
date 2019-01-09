import { validate, getSchema, T } from '../../../validator'
import Account from '../../../schema/backoffice/account'
import { ROLE } from '../../../schema/metadata/const'
import errors from '../../../error'

const SCHEMA = {
  merchant_code: T.string().regex(/^[a-zA-Z0-9_]+$/).min(6).max(50)
    .required(),
  auth_token: T.string().length(32).required(),
  game_platform_id: T.string().valid('2000').required(),
  sign: T.string().required(),
  username: T.string().regex(/^[a-zA-Z0-9_-]+$/).min(6).max(100)
    .required(),
  password: T.string().min(6).max(20).required(),
  role: T.number().integer().min(1).required(),
}

module.exports = (route) => {
  const createSubAccount = async (req, res, next) => {
    try {
      const { isMaster, company } = req.merchant
      if (!isMaster) throw new errors.PermissionDeniedError()
      const { username, password, role: scope } = validate(req.body, getSchema(
        SCHEMA, 'merchant_code', 'auth_token', 'game_platform_id', 'sign',
        'username', 'password', 'role'
      ))
      const detail = await Account.create(
        company, ROLE.COMPANY, { username, password, scope }, true
      )
      return res.json({
        success: true,
        code: 0,
        detail,
      })
    } catch (err) {
      return next(err)
    }
  }

  const updateSubAccount = async (req, res, next) => {
    try {
      const { isMaster, company } = req.merchant
      if (!isMaster) throw new errors.PermissionDeniedError()
      const { username, password, role: scope } = validate(req.body, getSchema(
        SCHEMA, 'merchant_code', 'auth_token', 'game_platform_id', 'sign',
        'username', 'password', 'role'
      ))
      const detail = await Account.update2(company, { username, password, scope })
      return res.json({
        success: true,
        code: 0,
        detail,
      })
    } catch (err) {
      return next(err)
    }
  }

  const deleteSubAccount = async (req, res, next) => {
    try {
      const { isMaster, company } = req.merchant
      if (!isMaster) throw new errors.PermissionDeniedError()
      const { username } = validate(req.body, getSchema(
        SCHEMA, 'merchant_code', 'auth_token', 'game_platform_id', 'sign', 'username'
      ))
      const detail = await Account.deleteAccount2(company, username)
      return res.json({
        success: true,
        code: 0,
        detail,
      })
    } catch (err) {
      return next(err)
    }
  }

  route.post('/create_sub_account', createSubAccount)
  route.post('/update_sub_account', updateSubAccount)
  route.post('/delete_sub_account', deleteSubAccount)
}
