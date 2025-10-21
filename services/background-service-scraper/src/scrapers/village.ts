import { CreatePool } from '../database'
import { decodePHPUrl } from '../helpers'
import { logger } from '../logger'
import { DatabaseVillage } from '../types'

export async function execute(domain: string): Promise<void> {
  const items = await fetchItems(domain)

  if (items.length === 0) {
    logger.Warning(`No villages found to upsert for domain ${domain}`)
    return
  }

  const chunkSize = 1000
  for (var i = 0; i < Math.ceil(items.length / chunkSize); i++) {
    await upsert(items.slice(i * chunkSize, (i + 1) * chunkSize))
  }
}

async function upsert(items: DatabaseVillage[]): Promise<void> {
  const pool = CreatePool()

  try {
    const values = items.map((_, i) => `($${i * 6 + 1}, $${i * 6 + 2}, $${i * 6 + 3}, $${i * 6 + 4}, $${i * 6 + 5}, $${i * 6 + 6})`).join(', ')
    const params = items.flatMap((p) => [p.village_id, p.village_name, p.village_x, p.village_y, p.player_id, p.village_points])

    const query = `
            INSERT INTO villages (village_id, village_name, village_x, village_y, player_id, village_points)
            VALUES ${values}
            ON CONFLICT (village_id)
            DO UPDATE SET
                player_id = EXCLUDED.player_id,
                village_points = EXCLUDED.village_points,
                village_name = EXCLUDED.village_name;
        `
    await pool.query(query, params)
    logger.Info(`Upserted ${items.length} villages`)
  } catch (err) {
    logger.Error('Failed to upsert villages', err as Error)
  } finally {
    await pool.end()
  }
}

async function fetchItems(domain: string): Promise<DatabaseVillage[]> {
  const url = `${domain}/map/village.txt`
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

function parseData(rawData: string): DatabaseVillage[] {
  return rawData
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && line.includes(','))
    .map((line) => {
      const [idStr, encodedName, xStr, yStr, player_idStr, pointsStr] = line.split(',')

      const village_id = Number(idStr)
      const village_name = decodePHPUrl(encodedName)
      const village_x = Number(xStr)
      const village_y = Number(yStr)
      const player_id = isNaN(Number(player_idStr)) || Number(player_idStr) == 0 ? null : Number(player_idStr)
      const village_points = Number(pointsStr)

      if (isNaN(village_id) || isNaN(village_x) || isNaN(village_y) || isNaN(village_points) || !village_name) {
        logger.Warning(`Invalid village data encountered: ${line}`)
        return null
      }

      return {
        village_id,
        village_name,
        village_x,
        village_y,
        player_id,
        village_points,
      } as DatabaseVillage
    })
    .filter((p): p is DatabaseVillage => p !== null)
}
