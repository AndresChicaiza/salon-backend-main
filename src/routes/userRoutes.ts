import { Router } from 'express'
import { authMiddleware } from '../middleware/authMiddleware'
import {
    checkUsername,
    createUserProfile,
    getUserProfile,
    updateUserProfile,
    deleteUserAccount,
} from '../controllers/userController'

const router = Router()

// Verificar disponibilidad de username (pública)
router.get('/check-username/:username', checkUsername)

// Rutas protegidas (requieren token Firebase)
router.post('/', authMiddleware, createUserProfile)
router.get('/', authMiddleware, getUserProfile)
router.put('/', authMiddleware, updateUserProfile)
router.delete('/', authMiddleware, deleteUserAccount)

export default router