import Link from 'next/link'
import { useQuery } from 'react-query'

async function fetchProperties(key) {
  const result = await fetch('/api/properties')
  const json = await result.json()
  return json.data
}

function Properties() {
  const { data, status } = useQuery<any[], string>(
    'properties',
    fetchProperties
  )
  return (
    <div>
      <h1>Properties</h1>
      {status === 'loading' && <h1>Loading...</h1>}
      <div className="flex flex-col">
        {data &&
          data.map((p) => (
            <Link
              key={p.id}
              href="/properties/[propertyId]"
              as={`/properties/${p.id}`}
            >
              <a className="underline font-semibold text-purple-500">
                {p.name}
              </a>
            </Link>
          ))}
      </div>
    </div>
  )
}

export default Properties
