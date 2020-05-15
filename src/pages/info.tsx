import { sessionWrap } from 'server'
import type { GetServerSideProps } from 'next'
import { db } from 'server'

export default function Info({ user, properties, tenants }) {
  return (
    <div>
      <h1 className="py-8 text-4xl font-bold">Info</h1>
      <p>User:</p>
      <pre>{JSON.stringify({ user, properties, tenants }, null, 2)}</pre>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await sessionWrap(ctx)

  const { req, res } = ctx
  const user: any = req.session.get('user') || null
  let response: any = {
    props: {
      user,
    },
  }
  if (!user || user.username !== 'cdock') {
    res.writeHead(302, { Location: '/login' })
    res.end()
    return response
  }

  const propertyPromise = db('property').select()
  const tenantPromise = db('tenant').select()

  const [properties, tenants] = await Promise.all([
    propertyPromise,
    tenantPromise,
  ])

  response.props.properties = properties
  response.props.tenants = tenants

  return response
}
