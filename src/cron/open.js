const CronJob = require('cron').CronJob


const runNotifyWillDrawSchedule = () => {
  /* eslint-disable no-new */
  const cronTime = '* 0 12 * * *'
  const onTick = (() => {
    // 寄送抽獎通知
    console.log(`寄送即將開獎通知 : ${new Date()}`)
  })
  const onComplete = null
  const start = true
  const timeZone = 'Europe/London'

  new CronJob(cronTime, onTick, onComplete, start, timeZone)

  console.log('Start [NotifyWillDraw] schedule')
}


module.exports = {
  runNotifyWillDrawSchedule
}
