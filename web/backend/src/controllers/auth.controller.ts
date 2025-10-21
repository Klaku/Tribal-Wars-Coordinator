import { Express } from 'express'
import passport from 'passport'

export function authController(app: Express) {
  app.get(
    '/api/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  )

  app.get(
    '/api/auth/google/callback',
    passport.authenticate('google', {
      failureRedirect: process.env.WEB_AUTH_FAILED_REDIRECT,
      successRedirect: process.env.WEB_AUTH_SUCCESS_REDIRECT,
    })
  )

  app.get('/api/auth/failure', (_req, res) => {
    res.send('Failed to authenticate')
  })

  app.get('/api/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) console.error(err)
      res.redirect(process.env.WEB_AUTH_LOGOUT_REDIRECT!)
    })
  })
}
