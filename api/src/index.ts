import app from './app'
import config from './services/config'

app.listen(config.PORT, async () => {
    console.log(`Listening: http://localhost:${config.PORT}`)
})
