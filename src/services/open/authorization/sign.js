const crypto = require('crypto')

const isJson = x => {
  try {
    const x2 = JSON.parse(JSON.stringify(x))
    for (const k in x) {
      if (x2[k] !== x[k]) throw new Error()
    }
  } catch (e) {
    return false
  }
  return true
}

// sign key是存放在merchant的server端的, 不会在调用api的时候传入
// 根据merchant code获得sign key然后验证签名
// 所有非空值连接成一个字符串，把上面的签名秘钥放到最后，然后使用 sha1 的方法生成签名
// 所有参数的顺序要按参数名的字母顺序
// 忽略所有json类型字段和sign字段
// 所有参数默认编码utf-8
module.exports = (signKey, data) => {
  if (!signKey || !data || Object.keys.length <= 0) return null
  const keyArr = []
  for (const key of Object.keys(data)) {
    if (key === 'sign') continue
    const value = data[key]
    if (value instanceof Date) data[key] = value.getTime()
    else if (typeof value === 'object' && isJson(value)) continue
    keyArr.push(key)
  }
  keyArr.sort()
  let str = ''
  for (const key of keyArr) {
    if (!data.hasOwnProperty(key)) continue
    str += data[key]
  }
  str += signKey
  const hash = crypto.createHash('sha1')
  hash.update(str)
  return hash.digest('hex')
}
