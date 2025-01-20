import express, { Application } from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import { connectDB } from './utils/connectDB'
import waterQualityRoutes from './routes/waterQuality.routes'
import userRoutes from './routes/user.routes'
import { errorMiddleware } from './middlewares/error.middlewares'
import cookieParser from 'cookie-parser'

const app: Application = express()

config({
    path: './.env.local',
})

const port = process.env.PORT || 3000
const mongoURI = process.env.MONGO_URI || ''

connectDB(mongoURI)

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
)

app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send('API is Working with /api/v1')
})

app.use('/api/v1/water-quality', waterQualityRoutes)
app.use('/api/v1/user', userRoutes)

app.use(errorMiddleware)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})

export default app
