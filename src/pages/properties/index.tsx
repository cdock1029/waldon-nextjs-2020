import Link from 'next/link'
import { useQuery } from 'react-query'
import { useAuth } from 'data/firebase'
import { Loading } from 'components'

async function fetchProperties(key, token) {
  const result = await fetch('/api/properties', {
    headers: { Authorization: `Bearer ${token}` },
  })
  const json = await result.json()
  return json.data
}

function Properties() {
  const { tokenResult } = useAuth()
  const { data } = useQuery<any[], [string, string]>(
    ['properties', tokenResult!.token],
    fetchProperties
  )
  return (
    <div>
      <h1>Properties</h1>
      <div className="flex flex-col items-start">
        {data &&
          data.map((p) => (
            <Link
              key={p.id}
              href="/properties/[propertyId]"
              as={`/properties/${p.id}`}
            >
              <a className="underline font-semibold">{p.name}</a>
            </Link>
          ))}
      </div>
    </div>
  )
}

export default Properties
