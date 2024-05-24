import dotenv from 'dotenv'

dotenv.config()

export default {
    VERSION: 1,
    PORT: 4000,
    APP_ENV: process.env.APP_ENV || 'development',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
}
