import Link from 'next/link'

import type { GetStaticProps } from 'next'
import { db } from 'server'

export default function Properties({ properties }: { properties: Property[] }) {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="py-8 m-0">Properties</h1>
      </div>
      {properties.map((p) => (
        <p key={p.id}>
          <Link href={`/properties#${p.id}`}>
            <a>{p.name}</a>
          </Link>
        </p>
      ))}
    </>
  )
}

export const getStaticProps: GetStaticProps<{
  properties: Property[]
}> = async (context) => {
  return {
    props: {
      properties: await db('property').select().orderBy('name'),
    },
  }
}
