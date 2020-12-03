import express, { NextFunction, Request, Response } from 'express'

const lobbyRoutes = express.Router()

lobbyRoutes.get('/lobbies')

export default lobbyRoutes
