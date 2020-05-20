import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from 'react'
import Router from 'next/router'
import formatDate from 'intl-dateformat'
import { useImmer } from 'use-immer'
import { useLocalStorage } from 'react-use'

type Result<T> = { data?: T; redirect?: boolean; error?: string }
export async function fetchGuard<T>(requestInfo: RequestInfo) {
  const controller = new AbortController()
  const signal = controller.signal

  const promise: Promise<T | undefined> & { cancel?: () => void } = fetch(
    requestInfo,
    {
      method: 'get',
      signal,
      credentials: 'same-origin',
    }
  )
    .then((res) => res.json())
    .then(async (result: Result<T>) => {
      if (result.redirect) {
        await Router.replace('/login')
        return
      }
      if (result.error) {
        console.log('**fetch error**', result.error)
        throw new Error(result.error)
      }
      return result.data
    })
  promise.cancel = controller.abort
  return promise
}

type PropertyContext = {
  property: Property | null
  updateProperty(property: Property | null): void
}
const PropertyContext = createContext<PropertyContext>({
  property: null,
  updateProperty: () => {},
})

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [storedProperty, setStoredProperty] = useLocalStorage<Property | null>(
    'wpm:property',
    null
  )
  const [value, updateValue] = useImmer<PropertyContext>({
    property: storedProperty!,
    updateProperty: (newProperty: Property) => {
      setStoredProperty(newProperty)
      updateValue((draft) => {
        draft.property = newProperty
      })
    },
  })

  return <PropertyContext.Provider value={value} children={children} />
}

export function useSelectedProperty() {
  const [postRenderState, setPostRenderState] = useState<PropertyContext>(
    {} as any
  )
  const ctx = useContext(PropertyContext)
  useEffect(() => {
    setPostRenderState(ctx)
  }, [ctx, setPostRenderState])
  return postRenderState
}

export function format(str: string, mask?: string) {
  return formatDate(new Date(str), mask ?? 'YY MMM DD')
}
