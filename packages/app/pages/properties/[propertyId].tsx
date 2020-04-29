import fetch from '@brillout/fetch'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'

const data = [
  { id: 1, name: 'Acme' },
  { id: 2, name: 'Westbury Park' },
]

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch(`${process.env.URL}/api/properties`)
  const result = await response.json()
  const properties = result.data
  return {
    paths: properties.map((p) => ({
      params: { propertyId: String(p.id) },
    })),
    fallback: true,
  }
}

export async function getStaticProps({ params: { propertyId } }) {
  const response = await fetch(
    `${process.env.URL}/api/properties/${propertyId}`
  )
  const result = await response.json()

  return {
    props: { property: result.data },
  }
}

function Property({ property }) {
  const {
    // query: { propertyId },
    isFallback,
  } = useRouter()
  // console.log('log router:', { propertyId })
  return (
    <div>
      {isFallback ? <h1>LOADING...</h1> : null}
      <h1>Property: {property.name}</h1>
    </div>
  )
}

export default Property
