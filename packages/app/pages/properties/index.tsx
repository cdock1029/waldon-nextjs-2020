import Link from 'next/link'
import fetch from '@brillout/fetch'

export async function getStaticProps(context) {
  const response = await fetch(`${process.env.URL}/api/properties`)
  const result = await response.json()

  return {
    props: { properties: result.data },
  }
}

function Properties({ properties }: { properties: any[] }) {
  return (
    <div>
      <h1>Properties</h1>
      <div className="flex flex-col">
        {properties.map((p) => (
          <Link
            key={p.id}
            href="/properties/[propertyId]"
            as={`/properties/${p.id}`}
          >
            <a className="underline font-semibold text-purple-500">{p.name}</a>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Properties
