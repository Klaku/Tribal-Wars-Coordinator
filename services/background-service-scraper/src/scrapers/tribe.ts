import { CreatePool } from '../database'
import { decodePHPUrl } from '../helpers'
import { logger } from '../logger'
import { DatabaseTribe } from '../types'

export async function execute(domain: string): Promise<void> {
  const items = await fetchItems(domain)

  if (items.length === 0) {
    logger.Warning(`No tribes found to upsert for domain ${domain}`)
    return
  }

  const chunkSize = 1000
  for (var i = 0; i < Math.ceil(items.length / chunkSize); i++) {
    await upsert(items.slice(i * chunkSize, (i + 1) * chunkSize))
  }
}

async function upsert(items: DatabaseTribe[]): Promise<void> {
  const pool = CreatePool()

  try {
    const values = items.map((_, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`).join(', ')
    const params = items.flatMap((p) => [p.tribe_id, p.tribe_name, p.tribe_tag])

    const query = `
            INSERT INTO tribes (tribe_id, tribe_name, tribe_tag)
            VALUES ${values}
            ON CONFLICT (tribe_id)
            DO UPDATE SET
                tribe_name = EXCLUDED.tribe_name,
                tribe_tag = EXCLUDED.tribe_tag;
        `

    await pool.query(query, params)
    logger.Info(`Upserted ${items.length} tribes`)
  } catch (err) {
    logger.Error('Failed to upsert tribes', err as Error)
  } finally {
    await pool.end()
  }
}

async function fetchItems(domain: string): Promise<DatabaseTribe[]> {
  const url = `${domain}/map/ally.txt`
  try {
    const response = await fetch(url)
    if (!response.ok) {
      logger.Warning(`Unexpected response ${response.status} from ${url}`)
      throw new Error(`Unexpected response ${response.status} from ${url}`)
    }

    const text = await response.text()
    return parseData(text)
  } catch (err) {
    logger.Error(`Failed to fetch data from ${url}`, err as Error)
    throw new Error(`Failed to fetch data from ${url}: ${(err as Error).message}`)
  }
}

function parseData(rawData: string): DatabaseTribe[] {
  return rawData
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && line.includes(','))
    .map((line) => {
      const [idStr, nameEncoded, tagEncoded] = line.split(',')

      const tribe_id = Number(idStr)
      const tribe_name = decodePHPUrl(nameEncoded)
      const tribe_tag = decodePHPUrl(tagEncoded)

      if (isNaN(tribe_id) || !tribe_tag || !tribe_name) {
        logger.Warning(`Invalid tribe data encountered: ${line}`)
        return null
      }

      return { tribe_id, tribe_name, tribe_tag } as DatabaseTribe
    })
    .filter((p): p is DatabaseTribe => p !== null)
}
