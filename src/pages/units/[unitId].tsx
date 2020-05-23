import { useQuery, queryCache } from 'react-query'
import { useRouter } from 'next/router'
import { fetchGuard, useSelectedProperty } from 'client'
import { db } from 'server'
import type { GetStaticPaths } from 'next'

async function fetchUnit(
  key,
  unitId: string | string[]
): Promise<Unit | undefined> {
  return fetchGuard<Unit>(`/api/polka/routes/units/${unitId}`)
}

export default function Unit() {
  const { property } = useSelectedProperty()
  const { query } = useRouter()
  const { data: unit } = useQuery(
    property && query.unitId ? ['units', query.unitId] : null,
    fetchUnit,
    {
      initialData: () => {
        if (!property) return undefined
        const arr = queryCache.getQueryData<Unit[]>(['units', property!.id])
        const cached = arr?.find(
          (u) => u.id === parseInt(query.unitId as string)
        )
        return cached
      },
    }
  )
  return (
    <>
      <h1 className="py-8 m-0 text-3xl">Unit: {unit ? unit.name : ''}</h1>
      <p>todo</p>
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
