const Nexmo = require('nexmo')
const config = require('./config')
const log = require('../logger')
const errors = require('../error')
const nexmoErrRef = require('./errors')

const FROM = 'Tripleonetech'
const OPTS = {
  type: 'unicode'
}


/**
 * 检查手机号码格式
 * @param {String} cty_cod  国际码
 * @param {String} mobile 手机号码
 */
const format = (cty_cod, mobile) => {
  const phoneNum = String(Number(mobile)) // 为了让mobild第一个号码不为0，所以先转成数型态再转回字符串。
  const country_cod = cty_cod ? String(cty_cod).replace(/\+/g, '') : '' // Remove symbol +
  return country_cod + phoneNum
}

/**
 * 寄送简讯
 * @param {String} phoneNum  手机号码(已加國際碼)
 * @param {String} text 简讯内容
 */
const send = (phoneNum, text) =>
  new Promise((resolve, reject) => {
    const nexmo = new Nexmo({
      apiKey: config.apiKey,
      apiSecret: config.apiSecret
    })
    const to = phoneNum

    if (__TEST__) {
      log.warn("DEV or TEST env doesn't trigger SMS sending")
      resolve()
    }
    nexmo.message.sendSms(FROM, to, text, OPTS, (err, data) => {
      /** *
       * data :
            { 'message-count': '1',
                messages:
                [ { to: '886938891988',
                'message-id': '0F0000010DE3C4C8',
                status: '0',
                'remaining-balance': '10.00010000',
                'message-price': '0.04420000',
                network: '46601' } ]
            }
        * */
      if (err) {
        return reject(err)
      }
      if (data && data.messages.length > 0) {
        const msgInfo = data.messages[0]
        if (msgInfo.status === '0') {
          log.info(`Sended SMS to [${to}]. message_id: ${msgInfo['message-id']}`)
        } else if (nexmoErrRef[msgInfo.status]) {
          reject(new errors[`${nexmoErrRef[msgInfo.status]}Error`]())
        } else {
          return reject(new Error(msgInfo['error-text']))
        }
        resolve(msgInfo)
      }
    })
  })

/**
 * 群發簡訊
 * @param {String} mobile_list
 * @param {String} content
 */
const sendGroup = (mobile_list, content) => new Promise((success, fail) => {
  const nexmo = new Nexmo({
    apiKey: config.apiKey,
    apiSecret: config.apiSecret
  })
  const promiseArr = []
  const phoneArr = typeof mobile_list === 'string' ? mobile_list.split(',') : ''
  for (const to of phoneArr) {
    promiseArr.push(
      new Promise((resolve, reject) => {
        nexmo.message.sendSms(FROM, to, content, OPTS, (err, data) => {
          if (err) return reject(err)
          const resInfo = data.messages[0]
          if (resInfo.status !== '0') {
            return reject(resInfo)
          }
          resolve(resInfo)
        })
      })
    )
  }
  Promise.all(promiseArr)
    .then(results => {
      const sentMobileArr = results.map(m => m.to)
      const msgIdArr = results.map(m => m['message-id'])
      log.info(`Sended SMS to [${sentMobileArr.join(',')}]. message_id: ${msgIdArr.join(',')}`)
      success(sentMobileArr)
    })
    .catch(reason => {
      if (nexmoErrRef[reason.status]) {
        fail(new errors[`${nexmoErrRef[reason.status]}Error`]())
      }
    })
})

module.exports = {
  send,
  sendGroup,
  format
}
