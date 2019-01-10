// import url from 'url'
// import mm from 'micromatch'
const url = require('url')
const mm = require('micromatch')

const routes = []

const add = urlPath => {
  if (!urlPath) return
  let path = urlPath.toLowerCase()
  if (!path.startsWith('/')) {
    path = `/${path}`
  }
  routes.push(path)
}

const has = urlPath => {
  if (!urlPath) return false
  const pathname = url.parse(urlPath).pathname.toLowerCase()
  return mm.any(pathname, routes)
}

module.exports = {
  add,
  has
}
