import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
}))
app.use(express.json())

// Ruta de salud — verifica que el servidor está corriendo
app.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        service: 'backend-main',
        timestamp: new Date().toISOString(),
    })
})

app.listen(PORT, () => {
    console.log(`✅ Backend main corriendo en http://localhost:${PORT}`)
})