const StrUtil = require('../../utils/str')
const errors = require('../../error')
const SMS = require('../../sms')
/**
 * 取得玩家的LuckyDraw
 * @param {Object} queryData
 */
const getPlayerLuckyDraw = async (queryData) => {
  const { merchant_code, country_code, mobile } = queryData
  const phoneNum = SMS.format(country_code, mobile)
  const querySQL = `
    SELECT lucky_draw
    FROM player
    WHERE merchant_code = ? and mobile
  ;`
  const result = await db.query(querySQL, [merchant_code, phoneNum])
  if (result.length === 0) {
    return ''
  }
  return result[0].lucky_draw
}

/**
 * 生成玩家的開獎號碼(luckyDraw)
 * 1. 如果此玩家有開獎號碼，則回傳舊的luckyDraw
 * 2. 產生luckyDraw時要避免產生相同的luckyDraw
 */
const genDrawNum = async (merchant_code, phoneNum, name) => {
  const querySQL = `
    SELECT mobile, lucky_draw
    FROM player
    WHERE merchant_code = ? 
  `
  const results = await db.query(querySQL, [merchant_code])
  const allDrawNum = results.map(m => m.lucky_draw) // 存放此merchant下所有玩家的開獎號碼

  let luckyDraw = StrUtil.random(8, 'letter')
  let isNotDup = false
  while (isNotDup === false) {
    //  判斷是否生成重複的luckyDraw
    if (allDrawNum.indexOf(luckyDraw) > -1) {
      luckyDraw = StrUtil.random(8, 'letter')
    } else {
      isNotDup = true
    }
  }
  const insertSQL = `
     INSERT INTO player (merchant_code, name, mobile, lucky_draw)
     VALUES (?, ?, ?, ?)
  ;`
  const saveRes = await db.query(insertSQL, [merchant_code, name, phoneNum, luckyDraw])
  if (saveRes.affectedRows <= 0) throw new errors.ImATeapotError()
  return luckyDraw
}

/**
 * 確認此玩家有沒有中獎
 */
const checkIsWinning = async (queryData) => {
  const { merchant_code, country_code, mobile } = queryData
  const phoneNum = SMS.format(country_code, mobile)
  let isWinning = false
  const querySQL = `
      SELECT count(winner_mobile) as cnt
      FROM winning
      WHERE merchant_code = ? and winner_mobile = ?
  ;`
  const result = await db.query(querySQL, [merchant_code, phoneNum])
  if (result[0].cnt > 0) {
    isWinning = true
  }
  return isWinning
}

const notifyWillDrawLottery = () => {
  // 通知即將開獎 ，由排程觸發

}

module.exports = {
  genDrawNum,
  getPlayerLuckyDraw,
  checkIsWinning,
  notifyWillDrawLottery
}
