import dotenv from 'dotenv'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { CreatePool } from '../database'
import UserService from '../services/user.service'
import { dtoUser } from '../types/app.types'
import { logger } from '../logger'

dotenv.config()

passport.serializeUser((user, done) => {
  done(null, (user as dtoUser).user_id)
})

passport.deserializeUser(async (id: string, done) => {
  try {
    const dtoUser = (await UserService.GetById(id))[0]
    done(null, dtoUser)
  } catch (err) {
    done(err, null)
  }
})

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      logger.Info('Google Strategy Invoked')
      const pool = CreatePool()
      const dto_user = [
        profile.id,
        profile.displayName,
        profile.emails?.[0].value,
      ]
      logger.Debug(`Login of user: ${profile.emails?.[0].value}`)
      const query = `
                INSERT INTO users (user_id, user_name, user_email)
                VALUES ($1, $2, $3)
                ON CONFLICT (user_id)
                DO NOTHING;
            `
      await pool.query(query, dto_user)
      await pool.end()
      logger.Debug('User upserted into database')

      const users = await UserService.GetById(profile.id)
      if (users.length == 0) {
        logger.Warning(`User with id: ${profile.id} has been not found`)
        return done(new Error(`User with id: ${profile.id} has been not found`))
      }

      return done(null, users[0])
    }
  )
)
