import Link from 'next/link'
import { useQuery } from 'react-query'
import { useSelectedProperty } from 'client/data'
import Router from 'next/router'
import { Layout } from 'components'

async function fetchUnits(key, propertyId: number): Promise<Unit[]> {
  const json = await fetch(`/api/units?propertyId=${propertyId}`).then((res) =>
    res.json()
  )
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
    <Layout>
      <h1 className="flex items-start">
        Property: {property && property.name}
      </h1>

      <ul>
        {units &&
          units.map((u) => (
            <li key={u.id}>
              <Link key={u.id} href="/units/[unitId]" as={`/units/${u.id}`}>
                <a className="underline font-semibold">{u.name}</a>
              </Link>
            </li>
          ))}
      </ul>
    </Layout>
  )
}

export default Units
