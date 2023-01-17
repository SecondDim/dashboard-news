import { CronJob } from 'cron'
import { logger } from './utils/logger'

const cron = new CronJob('0 0 * * * *',
  () => {
    logger.info('Executing cron job once every hour')
  },
  () => {
    logger.info('Done cron job once every hour')
  },
  false,
  'Asia/Taipei')

// Use this if the 4th param is default value(false)
// job.start()

export { cron }
