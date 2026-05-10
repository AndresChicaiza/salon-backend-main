import * as admin from 'firebase-admin'
import dotenv from 'dotenv'
dotenv.config()

if (!admin.apps.length) {
    const privateKeyBase64 = process.env.FIREBASE_PRIVATE_KEY_BASE64
    const privateKey = privateKeyBase64
        ? Buffer.from(privateKeyBase64, 'base64').toString('utf8')
        : undefined

    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey,
        }),
    })
}

export const db = admin.firestore()
export const auth = admin.auth()