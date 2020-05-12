import { app } from 'server/polka'

export default app.handler

export const config = {
  api: {
    externalResolver: true,
  },
}
