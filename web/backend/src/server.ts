import dotenv from 'dotenv'
import './strategies/google'
import express from 'express'
import { configureApp } from './midlewares'
import { authController, playerController, userController } from './controllers'
import { logger } from './logger'
dotenv.config()
const app = express()

configureApp(app)

authController(app)
userController(app)
playerController(app)

app.listen(8000, () => logger.Info(`Web Server Started`))
