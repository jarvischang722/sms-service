const open = require('./open')

/** ******* Cron Ranges********
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    │
│    │    │    │    │    └ day of week (0-6 (Sun-Sat))
│    │    │    │    └───── month (1 - 12) Jan-Dec
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59)
 */
const run = () => {
  // open.runNotifyWillDrawSchedule()
}

module.exports = {
  run
}
