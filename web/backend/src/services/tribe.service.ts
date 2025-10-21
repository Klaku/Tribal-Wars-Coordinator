import { CreatePool } from '../database'
import { DatabaseTribe } from '../types/db.types'

class TribeService {
  public static GetById = async (id: number) => {
    const pool = CreatePool()
    const query = 'SELECT * FROM tribes WHERE tribe_id = $1'
    const result = await pool.query<DatabaseTribe>(query, [id])
    await pool.end()
    return result.rows
  }
}

export default TribeService
