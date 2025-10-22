import type {
  DatabasePlayer,
  DatabaseRoleAssignment,
  DatabaseTribe,
  DatabaseUser,
  DatabaseVillage,
} from '@/types/db.types'

export type dtoPlayer = DatabasePlayer & {
  tribe: DatabaseTribe
  villages: DatabaseVillage
}

export type dtoUser = DatabaseUser & {
  players: dtoPlayer[]
  roles: DatabaseRoleAssignment[]
}

export type dtoVillage = DatabaseVillage & {
  tribe: DatabaseTribe
}
