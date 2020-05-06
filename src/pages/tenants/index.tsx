import { Layout } from 'components'
import { useQuery } from 'react-query'
import { fetchGuard } from 'client'
import { NewTenant } from 'components'

async function fetchTenants() {
  return fetchGuard<Tenant[]>('/api/polka/routes/tenants')
}

export default function Tenants() {
  const { status, data, refetch } = useQuery('tenants', fetchTenants)

  return (
    <Layout>
      <div className="flex justify-between items-center">
        <h1 className="py-8 m-0">Tenants</h1>
        <NewTenant refetchTenants={refetch} />
      </div>
      {status === 'loading' && <p>Loading...</p>}
      {data && data.map((t) => <p key={t.id}>{t.full_name}</p>)}
    </Layout>
  )
}
