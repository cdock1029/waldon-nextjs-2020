import Link from 'next/link'
import { Properties as PropertiesData } from 'server/polka/properties'

import type { GetStaticProps } from 'next'

export default function Properties({ properties }: { properties: Property[] }) {
  return (
    <>
      <div className="flex justify-between items-center">
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
      properties: await PropertiesData.list(),
    },
  }
}
