import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import { Layout } from 'components'
import { fetchGuard } from 'client'

async function fetchUnit(key, unitId: string): Promise<Unit | undefined> {
  return fetchGuard<Unit>(`/api/units/${unitId}`)
}

export default function Unit() {
  const {
    query: { unitId },
  } = useRouter()
  const { data: unit } = useQuery(['units', unitId!.toString()], fetchUnit)
  return (
    <Layout>
      <h1 className="m-0 py-8 text-3xl">Unit: {unit ? unit.name : ''}</h1>
      <p>todo</p>
    </Layout>
  )
}
