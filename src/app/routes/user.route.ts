import { UserController } from '@controllers/index'
import { restrict } from '@middlewares/jwt'
import express from 'express'

const userRoutes = express.Router()

userRoutes.get('/user/exists/:key/:value', UserController.checkIfExists)
userRoutes.post('/user', UserController.save)

export default userRoutes
