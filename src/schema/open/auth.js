const strUtils = require('../../utils/str')

const getOpenToken = async merchantId => {
  const { redis } = db.connections
  if (!redis) return null
  const rkey = `open_auth_${merchantId}`
  const token = await redis.getAsync(rkey)
  const ttl = await redis.ttlAsync(rkey)
  return { token, ttl }
}

// 获取已有token，如果尚未过期，则返回已有token和剩余时间(s)
// 如果已过期，则生成新的token并刷新剩余时间(2h)
const generateOpenToken = async merchantId => {
  const { redis } = db.connections
  if (!redis) return null
  const rkey = `open_auth_${merchantId}`
  const token = await redis.getAsync(rkey)
  const ttl = await redis.ttlAsync(rkey)
  if (token && ttl > 0) {
    return {
      auth_token: token,
      timeout: ttl
    }
  }
  const newToken = strUtils.generateKey()
  redis.client.set(rkey, newToken, 'EX', 7200)
  return {
    auth_token: newToken,
    timeout: 7200
  }
}

module.exports = {
  getOpenToken,
  generateOpenToken
}
