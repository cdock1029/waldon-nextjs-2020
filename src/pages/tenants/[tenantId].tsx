import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { fetchGuard } from 'client'

function fetchTenant(key, tenantId: string): Promise<Tenant | undefined> {
  return fetchGuard<Tenant>(`/api/polka/routes/tenants/${tenantId}`)
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
    <>
      <div className="py-8">
        <h1 className="text-3xl m-0">
          {tenant ? tenant.full_name : <span>&nbsp;</span>}
        </h1>
        <small className="opacity-75 font-semibold uppercase">Tenant</small>
      </div>
      <div>Content</div>
    </>
  )
}
