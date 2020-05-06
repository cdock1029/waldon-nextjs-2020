import Router from 'next/router'

const options = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  // hour: 'numeric',
  // minute: 'numeric',
  // second: 'numeric',
  // hour12: false,
  timeZone: 'America/New_York',
}
const formatter = new Intl.DateTimeFormat('en-US', options)
export function format(str: string) {
  let d = Date.parse(str)
  return formatter.format(d)
}

type Result<T> = { data?: T; redirect?: boolean; error?: string }

export async function fetchGuard<T>(requestInfo: RequestInfo) {
  const controller = new AbortController()
  const signal = controller.signal

  const promise: Promise<T | undefined> & { cancel?: () => void } = fetch(
    requestInfo,
    {
      method: 'get',
      signal,
    }
  )
    .then((res) => res.json())
    .then(async (result: Result<T>) => {
      if (result.redirect) {
        await Router.replace('/login')
        return
      }
      if (result.error) {
        throw new Error(result.error)
      }
      return result.data
    })
  promise.cancel = controller.abort
  return promise
}

export * from './data'
