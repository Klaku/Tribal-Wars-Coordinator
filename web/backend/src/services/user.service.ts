import { CreatePool } from '../database'
import { logger } from '../logger'
import { dtoUser } from '../types/app.types'
import { DatabaseRoleAssignment, DatabaseUser } from '../types/db.types'

class UserService {
  public static GetById = async (id: string) => {
    const pool = CreatePool()
    const query = `
            SELECT 
                u.user_id,
                u.user_name,
                u.user_email,
                COALESCE(
                    (
                        SELECT json_agg(
                            json_build_object(
                                'role_assignment_id', ra.role_assignment_id,
                                'role_id', ra.role_id,
                                'user_id', ra.user_id
                            )
                        )
                        FROM role_assignments AS ra
                        WHERE ra.user_id = u.user_id
                    ),
                    '[]'
                ) AS roles,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'player_id', p.player_id,
                            'player_name', p.player_name,
                            'tribe_id', p.tribe_id,
                            'tribe', CASE 
                                WHEN t.tribe_id IS NOT NULL THEN 
                                    json_build_object(
                                        'tribe_id', t.tribe_id,
                                        'tribe_name', t.tribe_name,
                                        'tribe_tag', t.tribe_tag
                                    )
                                ELSE NULL
                            END,
                            'villages', COALESCE(
                                (
                                    SELECT json_agg(
                                        json_build_object(
                                            'village_id', v.village_id,
                                            'village_name', v.village_name,
                                            'village_x', v.village_x,
                                            'village_y', v.village_y,
                                            'player_id', v.player_id,
                                            'village_points', v.village_points
                                        )
                                    )
                                    FROM villages AS v
                                    WHERE p.player_id = v.player_id
                                ),
                                '[]'
                            ) 
                        )
                    ) FILTER (WHERE p.player_id IS NOT NULL),
                    '[]'
                ) AS players
            FROM users AS u
            LEFT JOIN account_assignments AS aa 
                ON u.user_id = aa.user_id
            LEFT JOIN players AS p 
                ON aa.player_id = p.player_id
            LEFT JOIN tribes AS t
                ON p.tribe_id = t.tribe_id
            WHERE u.user_id = $1
            GROUP BY u.user_id;
        `
    const result = await pool.query<dtoUser>(query, [id])
    await pool.end()
    return result.rows
  }

  public static ListAll = async () => {
    const pool = CreatePool()
    const query = `
            SELECT 
                u.user_id,
                u.user_name,
                u.user_email,
                COALESCE(
                    (
                        SELECT json_agg(
                            json_build_object(
                                'role_assignment_id', ra.role_assignment_id,
                                'role_id', ra.role_id,
                                'user_id', ra.user_id
                            )
                        )
                        FROM role_assignments AS ra
                        WHERE ra.user_id = u.user_id
                    ),
                    '[]'
                ) AS roles,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'player_id', p.player_id,
                            'player_name', p.player_name,
                            'tribe_id', p.tribe_id,
                            'tribe', CASE 
                                WHEN t.tribe_id IS NOT NULL THEN 
                                    json_build_object(
                                        'tribe_id', t.tribe_id,
                                        'tribe_name', t.tribe_name,
                                        'tribe_tag', t.tribe_tag
                                    )
                                ELSE NULL
                            END,
                            'villages', COALESCE(
                                (
                                    SELECT json_agg(
                                        json_build_object(
                                            'village_id', v.village_id,
                                            'village_name', v.village_name,
                                            'village_x', v.village_x,
                                            'village_y', v.village_y,
                                            'player_id', v.player_id,
                                            'village_points', v.village_points
                                        )
                                    )
                                    FROM villages AS v
                                    WHERE p.player_id = v.player_id
                                ),
                                '[]'
                            ) 
                        )
                    ) FILTER (WHERE p.player_id IS NOT NULL),
                    '[]'
                ) AS players
            FROM users AS u
            LEFT JOIN account_assignments AS aa 
                ON u.user_id = aa.user_id
            LEFT JOIN players AS p 
                ON aa.player_id = p.player_id
            LEFT JOIN tribes AS t
                ON p.tribe_id = t.tribe_id
            GROUP BY u.user_id;
        `
    const result = await pool.query<dtoUser>(query, [])
    await pool.end()
    return result.rows
  }

  public static ToggleRole = async (
    issuer: dtoUser,
    role: DatabaseRoleAssignment
  ) => {
    const pool = CreatePool()
    const query = `
            SELECT * 
            FROM role_assignments
            WHERE
                role_id = $1 AND
                user_id = $2
        `
    const result = await pool.query<DatabaseRoleAssignment>(query, [
      role.role_id,
      role.user_id,
    ])
    if (result.rowCount == 0) {
      logger.Debug(
        `${issuer.user_email} willing to grant ${role.role_id} to ${role.user_id}`
      )
      const insertQuery = `
                INSERT INTO role_assignments (role_id, user_id)
                values ($1, $2)
            `
      await pool.query(insertQuery, [role.role_id, role.user_id])
      logger.Debug(`User ${role.user_id} role assignments has been updated`)
      pool.end()
      return { result: 'Granted' }
    } else {
      const deleteQuery = `
                DELETE FROM role_assignments
                WHERE 
                    role_id = $1 AND
                    user_id = $2
            `
      await pool.query(deleteQuery, [role.role_id, role.user_id])
      logger.Debug(`User ${role.user_id} role assignments has been updated`)
      pool.end()
      return { result: 'Revoked' }
    }
  }
}

export default UserService
