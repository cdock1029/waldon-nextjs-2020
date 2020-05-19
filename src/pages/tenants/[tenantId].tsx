import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
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
    fetchTenant
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
      properties: await db('property').select().orderBy('name'),
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  }
}
