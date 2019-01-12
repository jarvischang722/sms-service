const StrUtil = require('../../utils/str')
const errors = require('../../error')

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

  const match = results.filter(m => m.mobile === phoneNum)
  if (match.length > 0) return match[0].lucky_draw

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

const checkIsWinning = () => {
  // 查詢是否中獎 by mobile
}

const notifyWillDrawLottery = () => {
  // 通知即將開獎 ，由排程觸發

}

module.exports = {
  genDrawNum,
  checkIsWinning,
  notifyWillDrawLottery
}
