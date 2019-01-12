const uuidV4 = require('uuid/v4')

/**
 * 生成亂數
 * @param {Number} len : 亂數長度
 * @param {String} type : 亂數種類 ('letter' | 'number' , Default: letter + number)
 */
const random = (len = 8, type) => {
  let text = ''
  let raw = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  if (type === 'letter') {
    raw = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  } else if (type === 'number') {
    raw = '0123456789'
  }

  for (const i of Array.from(Array(len).keys())) {
    text += raw.charAt(Math.floor(Math.random() * raw.length))
  }

  return text
}

const generateKey = () => uuidV4().replace(/-/g, '')

const pad = (number, max) => {
  const num = +number
  if (num >= 10 ** max) return `${num}`
  const tmp = `${10 ** max + num}`
  return tmp.substr(1)
}

module.exports = {
  random,
  generateKey,
  pad
}
