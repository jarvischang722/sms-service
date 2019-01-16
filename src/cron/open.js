const CronJob = require('cron').CronJob
const log = require('../logger')

const runNotifyWillDrawSchedule = () => {
  /* eslint-disable no-new */
  const cronTime = '* 0 12 * * *'
  const onTick = (() => {
    // 寄送抽獎通知
    log.info(`寄送即將開獎通知 : ${new Date()}`)
  })
  const onComplete = null
  const start = true
  const timeZone = 'Europe/London'

  new CronJob(cronTime, onTick, onComplete, start, timeZone)

  log.info('Start [NotifyWillDraw] schedule')
}


module.exports = {
  runNotifyWillDrawSchedule
}
