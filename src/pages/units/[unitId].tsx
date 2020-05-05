import { useQuery } from 'react-query'
import Router, { useRouter } from 'next/router'
import { Layout } from 'components'

async function fetchUnit(key, unitId: string): Promise<Unit> {
  const json = await fetch(`/api/units/${unitId}`).then((res) => res.json())
  if (json.redirect) {
    Router.replace(json.redirect)
  }
  return json.data
}

function Unit(props) {
  const {
    query: { unitId },
  } = useRouter()
  const { data: unit } = useQuery(
    unitId ? ['units', unitId as string] : undefined,
    fetchUnit
  )
  return (
    <Layout>
      <h1>Unit: {unit ? unit.name : ''}</h1>
      <p>todo</p>
    </Layout>
  )
}

export default Unit
