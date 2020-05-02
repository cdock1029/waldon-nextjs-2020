import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import { useAuth } from 'client/firebase'

async function fetchUnit(key, unitId: string, token: string): Promise<Unit> {
  const json = await fetch(`/api/units/${unitId}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => res.json())
  return json.data
}

function Unit() {
  const { tokenResult } = useAuth()
  const {
    query: { unitId },
  } = useRouter()
  const { data: unit } = useQuery<Unit, [string, string, string]>(
    ['units', unitId as string, tokenResult!.token],
    fetchUnit
  )
  return (
    <div>
      <h1>Unit: {unit ? unit.name : ''}</h1>
      <p>todo</p>
    </div>
  )
}

export default Unit
