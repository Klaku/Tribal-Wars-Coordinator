import { CreatePool } from '../database'
import { DatabaseVillage } from '../types/db.types'

class VillageService {
  public static GetById = async (id: number, expand: string[]) => {
    const pool = CreatePool()
    const query = 'SELECT * FROM villages WHERE village_id = $1'
    const result = await pool.query<DatabaseVillage>(query, [id])
    await pool.end()
    return result.rows
  }
}

export default VillageService
