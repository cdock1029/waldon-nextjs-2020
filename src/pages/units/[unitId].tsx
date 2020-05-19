import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import { fetchGuard } from 'client'
import { db } from 'server'
import type { GetStaticPaths } from 'next'

async function fetchUnit(
  key,
  unitId: string | string[]
): Promise<Unit | undefined> {
  return fetchGuard<Unit>(`/api/polka/routes/units/${unitId}`)
}

export default function Unit() {
  const { query } = useRouter()
  const { data: unit } = useQuery(
    query.unitId ? ['units', query.unitId] : null,
    fetchUnit
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
