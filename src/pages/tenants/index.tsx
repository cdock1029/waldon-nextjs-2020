import { useQuery } from 'react-query'
import { fetchGuard } from 'client'
import { NewTenant } from 'components'
import Link from 'next/link'
import Head from 'next/head'
import { db } from 'server'

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
      <div className="flex items-center justify-between">
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

export async function getStaticProps(context) {
  return {
    props: {
      properties: await db.many('select id, name from property order by name'),
    },
  }
}
