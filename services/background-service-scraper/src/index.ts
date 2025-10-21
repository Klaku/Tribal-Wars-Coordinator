import { Worker, Queue, Job } from 'bullmq'
import IORedis from 'ioredis'
import { execute as scrapePlayers } from './scrapers/player'
import { execute as scrapeTribes } from './scrapers/tribe'
import { execute as scrapeVillages } from './scrapers/village'
import { ScraperJobData } from './types'
import { logger } from './logger'
const DOMAIN = process.env.DOMAIN!
const REDIS_HOST = process.env.REDIS_HOST!
const REDIS_PORT = 6379

const connection = new IORedis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  maxRetriesPerRequest: null,
})

const queueDefault = new Queue<ScraperJobData>('Default', { connection })

async function scheduleScrapingJob() {
  logger.Info(`Queuing scraping job for domain ${DOMAIN}`)
  await queueDefault.upsertJobScheduler(
    'scrap-tw-api',
    { pattern: '0 */15 * * * *' },
    {
      name: 'Scrap Tribal Wars API',
      data: { domain: DOMAIN },
      opts: {
        removeOnComplete: 50,
        removeOnFail: 50,
      },
    }
  )
}

new Worker<ScraperJobData>(
  'Default',
  async (job: Job<ScraperJobData>) => {
    try {
      logger.Info(`Starting job "${job.name}" for domain ${job.data.domain}`)

      await scrapeTribes(job.data.domain)
      await scrapePlayers(job.data.domain)
      await scrapeVillages(job.data.domain)

      return true
    } catch (error) {
      logger.Error(`Job "${job.name}" failed for domain ${job.data.domain}`, error as Error)
      throw error
    }
  },
  { connection }
)

scheduleScrapingJob().catch(() => {
  process.exit(1)
})
