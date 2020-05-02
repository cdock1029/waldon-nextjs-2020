import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { useAuth } from 'client/firebase'

async function fetchProperty(key, propertyId: string, token: string) {
  const resultPromise = fetch(`/api/properties/${propertyId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const unitResultPromise = fetch(`/api/units?propertyId=${propertyId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const [result, unitResult] = await Promise.all([
    resultPromise,
    unitResultPromise,
  ])
  const [json, unitJson] = await Promise.all([result.json(), unitResult.json()])
  return { property: json.data, units: unitJson.data }
}

function Property() {
  const { tokenResult } = useAuth()
  const {
    query: { propertyId },
  } = useRouter()
  const { data } = useQuery(
    ['properties', propertyId as string, tokenResult!.token],
    fetchProperty
  )
  return (
    <div>
      <h1 className="flex items-start">
        Property: {data && data.property.name}
      </h1>
      <ul>{data && data.units.map((u) => <li key={u.id}>{u.name}</li>)}</ul>
    </div>
  )
}

export default Property
