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
  const sessionCookie = req.cookies.session || ''
  // Verify the session cookie. In this case an additional check is added to detect
  // if the user's Firebase session was revoked, user deleted/disabled, etc.
  try {
    const decodedClaims = await admin
      .auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    return true
  } catch (e) {
    console.log('cookie not verified')
    res.status(401).json({ redirect: '/login' })
    return false
  }
}

export function createSessionCookie(
  idToken: string,
  sessionCookieOptions: admin.auth.SessionCookieOptions
) {
  return admin.auth().createSessionCookie(idToken, sessionCookieOptions)
}
export async function revokeSession(sessionCookie: string) {
  try {
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie)
    await admin.auth().revokeRefreshTokens(decodedClaims.uid)
  } catch (e) {
    console.log(e.message)
  }
}

export function cache(
  res: NextApiResponse,
  { maxAge = 60 }: { maxAge?: number } = {}
): NextApiResponse {
  res.setHeader('Cache-Control', `private, s-maxage=0`)
  return res
}
