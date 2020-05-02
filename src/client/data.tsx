import { createContext, ReactNode, useContext } from 'react'
import { useImmer } from 'use-immer'
import { useLocalStorage } from 'react-use'
import { useQuery } from 'react-query'
import { useAuth } from './firebase'

async function fetchProperties(key, token) {
  const result = await fetch('/api/properties', {
    headers: { Authorization: `Bearer ${token}` },
  })
  const json = await result.json()
  return json.data
}

export function useProperties() {
  const { tokenResult } = useAuth()
  return useQuery<Property[], [string, string]>(
    ['properties', tokenResult!.token],
    fetchProperties
  )
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
  return useContext(PropertyContext)
}
