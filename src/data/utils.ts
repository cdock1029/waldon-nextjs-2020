import type { NextApiRequest, NextApiResponse } from 'next'
import * as admin from 'firebase-admin'

const credential = JSON.parse(
  Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS!, 'base64').toString()
)

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(credential),
    databaseURL: 'https://waldon-aea37.firebaseio.com',
  })
}

export async function verifyToken(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Boolean> {
  if (req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ')
    if (parts.length === 2 && parts[0] === 'Bearer') {
      const token = parts[1]
      try {
        const result = await admin.auth().verifyIdToken(token)
        return true
      } catch (e) {
        console.log('*** ERROR *** ', e.message)
      }
    }
  }
  res.status(401).json({ error: 'Not authorized' })
  return false
}

export function cache(
  res: NextApiResponse,
  { maxAge = 1 }: { maxAge?: number } = {}
): NextApiResponse {
  res.setHeader(
    'Cache-Control',
    `private, max-age=${maxAge}, stale-while-revalidate=3600`
  )
  return res
}
