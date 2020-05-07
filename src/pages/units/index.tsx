import Link from 'next/link'
import { useQuery } from 'react-query'
import { useSelectedProperty, fetchGuard } from 'client'

async function fetchUnits(key, propertyId: number) {
  return fetchGuard<Unit[]>(`/api/polka/routes/units?propertyId=${propertyId}`)
}

function Units() {
  const { property } = useSelectedProperty()
  const { data: units } = useQuery(
    property && ['units', property.id],
    fetchUnits
  )
  return (
    <>
      <div className="py-8">
        <h1 className="text-3xl m-0">
          {property ? property.name : <span>&nbsp;</span>}
        </h1>
        <small className="opacity-75 font-semibold uppercase">Property</small>
      </div>

      <div>
        {units &&
          units.map((u) => (
            <p key={u.id}>
              <Link key={u.id} href="/units/[unitId]" as={`/units/${u.id}`}>
                <a className="underline font-semibold">{u.name}</a>
              </Link>
            </p>
          ))}
      </div>
    </>
  )
}

export default Units
