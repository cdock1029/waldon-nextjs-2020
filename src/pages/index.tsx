import { useSelectedProperty } from 'client'
import { Dashboard } from 'components'
import { db } from 'server'

export default function Index() {
  const { property } = useSelectedProperty()
  return (
    <Dashboard
      key={property ? property.id : 'no-property'}
      property={property}
    />
  )
}

export async function getStaticProps(context) {
  return {
    props: {
      properties: await db.many('select id, name from property order by name'),
    },
  }
}
