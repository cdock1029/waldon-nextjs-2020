import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import { Layout } from 'components'
import { fetchGuard } from 'client'

async function fetchUnit(
  key,
  unitId: string | string[]
): Promise<Unit | undefined> {
  return fetchGuard<Unit>(`/api/polka/routes/units/${unitId}`)
}

export default function Unit() {
  const { query } = useRouter()
  const { data: unit } = useQuery(
    query.unitId ? ['units', query.unitId] : null,
    fetchUnit
  )
  return (
    <Layout>
      <h1 className="m-0 py-8 text-3xl">Unit: {unit ? unit.name : ''}</h1>
      <p>todo</p>
    </Layout>
  )
}
