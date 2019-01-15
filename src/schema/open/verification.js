const { SMS_TEXT_TYPE, VERIFICATION } = require('../../metadata/const')
const StrUtil = require('../../utils/str')
const SMS = require('../../sms')
const SmsText = require('../backoffice/sms_text')
const errors = require('../../error')
const Draw = require('./draw')
const moment = require('moment')
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
  const phoneNum = SMS.format(country_code, mobile)
  const randomCode = await genVerifyCode(country_code, mobile)
  let smsText = await SmsText.getMsgContent(SMS_TEXT_TYPE.VERIFICATION_CODE)
  if (typeof smsText === 'string') {
    smsText = smsText.replace(/###verification_code###/g, randomCode)
  }

  await SMS.send(phoneNum, smsText)
}

const checkVerifyCode = async (postData) => {
  const { country_code, mobile, verification_code, merchant_code } = postData
  const phoneNum = SMS.format(country_code, mobile)
  let luckyDraw
  const querySQL = `
     SELECT mobile, last_updated
     FROM verification_code_mapping
     WHERE mobile = ? and verification_code = ? 
  `
  const result = await db.query(querySQL, [phoneNum, verification_code])

  if (result.length === 0) throw new errors.InvalidVerificationCodeError()

  const createTime = result[0].last_updated
  const overMins = moment().diff(createTime, 'minutes')

  if (overMins > VERIFICATION.OVER_MINUTS_TIME) throw new errors.VerificationCodeOvertimeError()

  // 刪除過期或是驗證過的驗證碼
  const delSQL = `
     DELETE FROM verification_code_mapping 
     WHERE mobile = ? or last_updated < ?;
  ;`
  const invaidDateTime = moment().subtract(VERIFICATION.OVER_MINUTS_TIME, 'minutes').format('YYYY-MM-DD HH:mm')
  await db.query(delSQL, [phoneNum, invaidDateTime])

  luckyDraw = await Draw.getPlayerLuckyDraw(postData)
  if (luckyDraw === null) {
    luckyDraw = await Draw.genDrawNum(merchant_code, phoneNum)
  }

  return luckyDraw
}

module.exports = {
  sendVerifyCode,
  checkVerifyCode
}
