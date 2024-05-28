import dotenv from 'dotenv'

dotenv.config()

export default {
    VERSION: 1,
    PORT: 4000,
    APP_ENV: process.env.APP_ENV || 'development',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
    // TODO: use url from env for now, later save it in the DB under settings
    RSS_URL: process.env.RSS_URL || '',
    TELEGRAM: {
        TOKEN: process.env.TELEGRAM_TOKEN || '',
        CHAT_ID: process.env.TELEGRAM_CHAT_ID || '',
    },
}
