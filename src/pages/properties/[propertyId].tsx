import { useRouter } from 'next/router'
import { useQuery } from 'react-query'

async function fetchProperty(key, propertyId: string) {
  const result = await fetch(`/api/properties/${propertyId}`)
  const json = await result.json()
  return json.data
}

function Property() {
  const {
    query: { propertyId },
  } = useRouter()
  const { data, status } = useQuery(
    ['properties', propertyId as string],
    fetchProperty
  )
  return (
    <div>
      {status === 'loading' ? <h1>LOADING...</h1> : null}
      <h1>Property: {data && data.name}</h1>
    </div>
  )
}

export default Property
