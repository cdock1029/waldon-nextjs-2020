import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from 'react'
import Router from 'next/router'
import { useImmer } from 'use-immer'
import { useLocalStorage } from 'react-use'
import { useQuery } from 'react-query'

async function fetchProperties() {
  const result = await fetch('/api/properties')
  const json = await result.json()
  if (json.redirect) {
    Router.replace(json.redirect)
  }
  return json.data
}

export function useProperties() {
  return useQuery<Property[], string>('properties', fetchProperties)
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
    property: storedProperty,
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
