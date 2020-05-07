import { useQuery } from 'react-query'
import { fetchGuard } from 'client'
import { NewTenant } from 'components'
import Link from 'next/link'

async function fetchTenants() {
  return fetchGuard<Tenant[]>('/api/polka/routes/tenants')
}

export default function Tenants() {
  const { status, data } = useQuery('tenants', fetchTenants)

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="py-8 m-0">Tenants</h1>
        <NewTenant />
      </div>
      {data &&
        data.map((t) => (
          <p key={t.id}>
            <Link as={`/tenants/${t.id}`} href="/tenants/[tenantId]">
              <a>{t.full_name}</a>
            </Link>
          </p>
        ))}
    </>
  )
}
