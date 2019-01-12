const { SMS_TEXT_TYPE } = require('../../metadata/const')
const StrUtil = require('../../utils/str')
const SMS = require('../../sms')
const SmsText = require('../backoffice/sms_text')
const errors = require('../../error')

/**
 * 更新手機號碼對應的驗證碼到資料庫
 * @param {String} randomCode
 * @param {String} phoneNumber
 */
const updatePlayerVerifyCode = async (randomCode, phoneNumber) => {
  const updateSql = `
        INSERT INTO verification_code_mapping(verification_code, mobile)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE verification_code = ?
      ;`
  const result = await db.query(updateSql, [randomCode, phoneNumber, randomCode])
  if (result.affectedRows <= 0) {
    throw new errors.InvalidSignatureError()
  }
}

/**
 * 產生驗證碼
 */
const genVerifyCode = async (country_code, mobile) => {
  const randomCode = StrUtil.random(6, 'number')
  await updatePlayerVerifyCode(randomCode, SMS.format(country_code, mobile))
  return randomCode
}

/**
 * 寄送驗證碼給玩家
 * @param {Object} postData
 */
const sendVerifyCode = async postData => {
  const { country_code, mobile } = postData
  const randomCode = await genVerifyCode(country_code, mobile)
  let smsText = await SmsText.getMsgContent(SMS_TEXT_TYPE.VERIFICATION_CODE)
  if (typeof smsText === 'string') {
    smsText = smsText.replace(/###verification_code###/g, randomCode)
  }

  if (__DEV__ || __TEST__) return

  SMS.send(country_code, mobile, smsText)
}

const checkVerifyCode = () => {
  // 驗證手機號是否正確
}

module.exports = {
  sendVerifyCode,
  checkVerifyCode
}
