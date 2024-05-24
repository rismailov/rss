import express from 'express'
import MessageResponse from '../types/interfaces/MessageResponse'

const router = express.Router()

router.get<{}, MessageResponse>('/healthcheck', (_, res) => {
    res.sendStatus(200)
})

export default router
