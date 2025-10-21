import { CreatePool } from '../database'
import { decodePHPUrl } from '../helpers'
import { logger } from '../logger'
import { DatabasePlayer } from '../types'

export async function execute(domain: string): Promise<void> {
  const items = await fetchItems(domain)

  if (items.length === 0) {
    logger.Warning(`No player data found for domain ${domain}`)
    return
  }

  const chunkSize = 1000
  for (var i = 0; i < Math.ceil(items.length / chunkSize); i++) {
    await upsert(items.slice(i * chunkSize, (i + 1) * chunkSize))
  }
}

async function upsert(items: DatabasePlayer[]): Promise<void> {
  const pool = CreatePool()

  try {
    const values = items.map((_, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`).join(', ')
    const params = items.flatMap((p) => [p.player_id, p.player_name, p.tribe_id])

    const query = `
            INSERT INTO players (player_id, player_name, tribe_id)
            VALUES ${values}
            ON CONFLICT (player_id)
            DO UPDATE SET
                player_name = EXCLUDED.player_name,
                tribe_id = EXCLUDED.tribe_id;
        `

    await pool.query(query, params)
    logger.Info(`Upserted ${items.length} players`)
  } catch (err) {
    logger.Error(`Failed to upsert players`, err as Error)
    throw err
  } finally {
    await pool.end()
  }
}

async function fetchItems(domain: string): Promise<DatabasePlayer[]> {
  const url = `${domain}/map/player.txt`
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

function parseData(rawData: string): DatabasePlayer[] {
  return rawData
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && line.includes(','))
    .map((line) => {
      const [idStr, nameEncoded, tribeIdStr] = line.split(',')

      const player_id = Number(idStr)
      const tribe_id = isNaN(Number(tribeIdStr)) || Number(tribeIdStr) == 0 ? null : Number(tribeIdStr)
      const player_name = decodePHPUrl(nameEncoded)

      if (isNaN(player_id) || !player_name) {
        logger.Warning(`Invalid player data line: "${line}"`)
        return null
      }

      return { player_id, player_name, tribe_id } as DatabasePlayer
    })
    .filter((p): p is DatabasePlayer => p !== null)
}
