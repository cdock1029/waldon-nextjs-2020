import Link from 'next/link'
import { useQuery } from 'react-query'
import { useSelectedProperty, fetchGuard } from 'client'
import { db } from 'server'

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
        <h1 className="m-0 text-3xl">
          {property ? property.name : <span>&nbsp;</span>}
        </h1>
        <small className="font-semibold uppercase opacity-75">Property</small>
      </div>

      <div>
        {units &&
          units.map((u) => (
            <p key={u.id}>
              <Link key={u.id} href="/units/[unitId]" as={`/units/${u.id}`}>
                <a className="font-semibold underline">{u.name}</a>
              </Link>
            </p>
          ))}
      </div>
    </>
  )
}

export default Units

export async function getStaticProps(context) {
  return {
    props: {
      properties: await db('property').select().orderBy('name'),
    },
  }
}
