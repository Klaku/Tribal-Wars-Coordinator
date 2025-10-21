import { CreatePool } from '../database'
import { DatabasePlayer } from '../types/db.types'

class PlayerService {
  public static GetById = async (id: number) => {
    const pool = CreatePool()
    const query = 'SELECT * FROM players WHERE player_id = $1'
    const result = await pool.query<DatabasePlayer>(query, [id])
    await pool.end()
    return result.rows
  }
}

export default PlayerService
