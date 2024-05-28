import express, { Request, Response } from 'express'
import MessageResponse from '../types/interfaces/MessageResponse'

const router = express.Router()

router.get('/healthcheck', (req: Request, res: Response<MessageResponse>) => {
    res.sendStatus(200)
})

export default router
