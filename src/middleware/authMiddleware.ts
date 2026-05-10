import { Request, Response, NextFunction } from 'express'
import { auth } from '../services/firebase'

export interface AuthRequest extends Request {
    user?: {
        uid: string
        email: string | undefined
    }
}

export async function authMiddleware(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Token no proporcionado' })
        return
    }

    const token = authHeader.split('Bearer ')[1]

    try {
        const decoded = await auth.verifyIdToken(token)
        req.user = {
            uid: decoded.uid,
            email: decoded.email,
        }
        next()
    } catch (error) {
        res.status(401).json({ error: 'Token inválido o expirado' })
    }
}