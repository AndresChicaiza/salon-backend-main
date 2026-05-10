import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import userRoutes from './routes/userRoutes'
import { swaggerDocument } from './swagger/swagger'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
}))
app.use(express.json())

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Rutas
app.use('/users', userRoutes)

// Ruta de salud
app.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        service: 'backend-main',
        timestamp: new Date().toISOString(),
    })
})

app.listen(PORT, () => {
    console.log(`✅ Backend main corriendo en http://localhost:${PORT}`)
    console.log(`📄 Swagger docs en http://localhost:${PORT}/api-docs`)
})