const uuidV4 = require('uuid/v4')

const random = (len = 8) => {
  let text = ''
  const raw = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

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

module.export = {
  random,
  generateKey,
  pad
}
