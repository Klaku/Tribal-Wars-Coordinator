import { Express, NextFunction, Request, Response, json } from 'express'
import passport from 'passport'
import session from 'express-session'
import connectPgSimple from 'connect-pg-simple'
import { CreatePool } from './database'
import { dtoUser } from './types/app.types'
import { logger } from './logger'

export function configureApp(app: Express) {
  const PgSession = connectPgSimple(session)
  logger.Debug('Postgres Session store initialized')
  app.use(
    session({
      store: new PgSession({
        pool: CreatePool(),
        tableName: 'user_sessions',
        createTableIfMissing: true,
      }),
      secret: process.env.WEB_SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 24 * 60 * 60 * 1000 },
    })
  )
  logger.Debug('Express Session middleware configured')
  app.use(passport.initialize())
  logger.Debug('Passport initialized')
  app.use(passport.session())
  logger.Debug('Passport session middleware configured')
  app.use(json())
  logger.Debug('Express JSON middleware configured')
}

const responseUnauthorized = (res: Response) =>
  res.status(401).json({ error: 'Unauthorized' })

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated?.()) return responseUnauthorized(res)
  next()
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated?.()) return responseUnauthorized(res)
  const isAdmin = (req.user as dtoUser).roles?.some((x) => x.role_id == 1)
  if (!isAdmin) return responseUnauthorized(res)
  next()
}

export function requireMember(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated?.()) return responseUnauthorized(res)
  const hasAnyRole = (req.user as dtoUser).roles?.some(
    (x) => x.role_id == 1 || x.role_id == 2
  )
  if (!hasAnyRole) return responseUnauthorized(res)
  next()
}
