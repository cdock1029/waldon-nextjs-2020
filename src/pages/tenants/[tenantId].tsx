import { useRouter } from 'next/router'
import { useQuery, queryCache } from 'react-query'
import { fetchGuard } from 'client'
import { db } from 'server'
import type { GetStaticPaths } from 'next'

function fetchTenant(key, tenantId: string): Promise<Tenant | undefined> {
  return fetchGuard<Tenant>(`/api/polka/routes/tenants/${tenantId}`)
}

export default function Tenant(props) {
  const {
    query: { tenantId },
  } = useRouter()
  const { data: tenant } = useQuery(
    tenantId ? ['tenants', tenantId as string] : null,
    fetchTenant,
    {
      initialData: () => {
        const arr = queryCache.getQueryData<Tenant[]>('tenants')
        const cached = arr?.find((t) => t.id === parseInt(tenantId as string))
        return cached
      },
    }
  )

  return (
    <>
      <div className="py-8">
        <h1 className="m-0 text-3xl">
          {tenant ? tenant.full_name : <span>&nbsp;</span>}
        </h1>
        <small className="font-semibold uppercase opacity-75">Tenant</small>
      </div>
      <div>Content</div>
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

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  }
}
