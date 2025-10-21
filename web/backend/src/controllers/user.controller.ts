import { Express } from 'express'
import { requireAdmin, requireAuth } from '../midlewares'
import UserService from '../services/user.service'
import { dtoUser } from '../types/app.types'
import { logger } from '../logger'

export function userController(app: Express) {
  app.get('/api/user/me', requireAuth, async (req, res) => {
    res.send(req.user)
  })

  app.get('/api/user/list', requireAuth, async (req, res) => {
    try {
      res.send(await UserService.ListAll())
    } catch (err) {
      logger.Error('/api/user/list Exception', err as Error)
      res.status(500).send({ message: (err as Error).message })
    }
  })

  app.post('/api/user/role', requireAdmin, async (req, res) => {
    try {
      res.send(await UserService.ToggleRole(req.user as dtoUser, req.body))
    } catch (err) {
      logger.Error('/api/user/role Exception', err as Error)
      res.status(500).send({ message: (err as Error).message })
    }
  })
}
