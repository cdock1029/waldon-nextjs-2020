import { useQuery } from 'react-query'
import { fetchGuard } from 'client'
import { NewTenant } from 'components'
import Link from 'next/link'
import Head from 'next/head'

async function fetchTenants() {
  return fetchGuard<Tenant[]>('/api/polka/routes/tenants')
}

export default function Tenants() {
  const { data } = useQuery('tenants', fetchTenants)

  return (
    <>
      <Head>
        <link
          rel="preload"
          href="/api/polka/routes/tenants"
          as="fetch"
          crossOrigin="anonymous"
        ></link>
      </Head>
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
