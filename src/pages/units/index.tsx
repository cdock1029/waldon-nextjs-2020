import Link from 'next/link'
import { useQuery } from 'react-query'
import { useSelectedProperty } from 'client'
import Router from 'next/router'
import { Layout } from 'components'

async function fetchUnits(key, propertyId: number): Promise<Unit[]> {
  const json = await fetch(
    `/api/polka/routes/units?propertyId=${propertyId}`
  ).then((res) => res.json())
  if (json.redirect) {
    Router.replace(json.redirect)
  }

  return json.data
}

function Units() {
  const { property } = useSelectedProperty()
  const { data: units } = useQuery(
    property && ['units', property.id],
    fetchUnits
  )
  return (
    <div>
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
    </div>
  )
}

export default Units
