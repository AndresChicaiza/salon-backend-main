import { Response } from 'express'
import { db, auth } from '../services/firebase'
import { AuthRequest } from '../middleware/authMiddleware'

// Verificar si username ya existe
export async function checkUsername(req: AuthRequest, res: Response) {
    const { username } = req.params

    try {
        const snapshot = await db
            .collection('users')
            .where('username', '==', username)
            .get()

        res.json({ available: snapshot.empty })
    } catch (error) {
        res.status(500).json({ error: 'Error al verificar username' })
    }
}

// Crear perfil de usuario en Firestore
export async function createUserProfile(req: AuthRequest, res: Response) {
    const { uid, email } = req.user!
    const { username, displayName, avatarUrl } = req.body

    if (!username || !displayName) {
        res.status(400).json({ error: 'username y displayName son requeridos' })
        return
    }

    try {
        // Verificar unicidad del username
        const snapshot = await db
            .collection('users')
            .where('username', '==', username)
            .get()

        if (!snapshot.empty) {
            res.status(409).json({ error: 'El username ya está en uso' })
            return
        }

        const userData = {
            uid,
            email: email || '',
            username,
            displayName,
            avatarUrl: avatarUrl || '',
            createdAt: new Date().toISOString(),
        }

        await db.collection('users').doc(uid).set(userData)
        res.status(201).json({ message: 'Perfil creado exitosamente', user: userData })
    } catch (error) {
        res.status(500).json({ error: 'Error al crear perfil' })
    }
}

// Obtener perfil de usuario
export async function getUserProfile(req: AuthRequest, res: Response) {
    const { uid } = req.user!

    try {
        const doc = await db.collection('users').doc(uid).get()

        if (!doc.exists) {
            res.status(404).json({ error: 'Perfil no encontrado' })
            return
        }

        res.json({ user: doc.data() })
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener perfil' })
    }
}

// Actualizar perfil de usuario
export async function updateUserProfile(req: AuthRequest, res: Response) {
    const { uid } = req.user!
    const { username, displayName, avatarUrl } = req.body

    try {
        // Si cambia username verificar unicidad
        if (username) {
            const snapshot = await db
                .collection('users')
                .where('username', '==', username)
                .get()

            const taken = snapshot.docs.some(doc => doc.id !== uid)
            if (taken) {
                res.status(409).json({ error: 'El username ya está en uso' })
                return
            }
        }

        const updates: Record<string, string> = {}
        if (username) updates.username = username
        if (displayName) updates.displayName = displayName
        if (avatarUrl) updates.avatarUrl = avatarUrl

        await db.collection('users').doc(uid).update(updates)
        res.json({ message: 'Perfil actualizado exitosamente' })
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar perfil' })
    }
}

// Eliminar cuenta de usuario
export async function deleteUserAccount(req: AuthRequest, res: Response) {
    const { uid } = req.user!

    try {
        await db.collection('users').doc(uid).delete()
        await auth.deleteUser(uid)
        res.json({ message: 'Cuenta eliminada exitosamente' })
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar cuenta' })
    }
}