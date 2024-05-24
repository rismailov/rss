import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'

import apiRouter from './api/api.router'
import * as middlewares from './services/middlewares'
import config from './services/config'

const app = express()

app.use(morgan(config.APP_ENV === 'development' ? 'dev' : 'combined'))
app.use(helmet())
app.use(cors({ origin: config.FRONTEND_URL.split(',') }))
app.use(express.json())

app.use('/api/v1', apiRouter)

app.use(middlewares.notFound)
app.use(middlewares.errorHandler)

export default app
