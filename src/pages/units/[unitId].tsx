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

function Unit() {
  const {
    query: { unitId },
  } = useRouter()
  const { data: unit } = useQuery<Unit, [string, string]>(
    ['units', unitId as string],
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
