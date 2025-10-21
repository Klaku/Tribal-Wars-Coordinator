import { CreatePool } from '../database'
import { DatabaseOperation } from '../types/db.types'

class OperationService {
  public static GetById = async (id: number) => {
    const pool = CreatePool()
    const query = 'SELECT * FROM operations WHERE operation_id = $1'
    const result = await pool.query<DatabaseOperation>(query, [id])
    await pool.end()
    return result.rows
  }
}

export default OperationService
