import { UserController } from '@controllers/index'
import express from 'express'

const userRoutes = express.Router()

userRoutes.get('/users', UserController.all)
userRoutes.get('/user/:user_id', UserController.byId)
userRoutes.get('/user/exists/:key/:value', UserController.checkIfExists)
userRoutes.post('/user', UserController.create)

export default userRoutes
