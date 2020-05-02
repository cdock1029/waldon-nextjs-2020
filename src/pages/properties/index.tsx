import Link from 'next/link'
import { useProperties, useSelectedProperty } from 'client/data'

function Properties() {
  const { data } = useProperties()
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
