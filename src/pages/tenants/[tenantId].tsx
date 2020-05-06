import Router, { useRouter } from 'next/router'
import { Layout } from 'components'
import { useQuery } from 'react-query'
import { fetchGuard } from 'client'

function fetchTenant(key, tenantId: string): Promise<Tenant | undefined> {
  return fetchGuard<Tenant>(`/api/tenants/${tenantId}`)
}

export default function Tenant(props) {
  const {
    query: { tenantId },
  } = useRouter()
  const { data: tenant } = useQuery(
    tenantId ? ['tenants', tenantId as string] : null,
    fetchTenant
  )

  return (
    <Layout>
      <div className="max-w-xl w-full mx-auto">
        <h1>Tenant {tenant ? tenant.full_name : null}</h1>
      </div>
    </Layout>
  )
}
