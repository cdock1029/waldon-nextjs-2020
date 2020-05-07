import { useQuery } from 'react-query'
import { fetchGuard, format } from 'client'

function fetchTxns(key, leaseId: number) {
  return fetchGuard<Transaction[]>(
    `/api/polka/routes/transactions?leaseId=${leaseId}`
  )
}

const minRows = 2
export function Transactions({ leaseId }: { leaseId: number }) {
  const { status, data, error } = useQuery(['transactions', leaseId], fetchTxns)

  if (error) {
    return <div className="text-red-300">{(error as Error).message}</div>
  }

  console.log({ leaseId, data })

  return (
    <>
      <h2 className="m-0 text-2xl py-4 opacity-75">Transactions</h2>
      <div className="bg-gray-800 rounded shadow-md p-4">
        <table className="w-full">
          <thead className="opacity-50 uppercase">
            <tr>
              <th align="right">Date</th>
              <th align="right">Amount</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {data ? (
              data.map((t) => (
                <tr key={t.id}>
                  <td align="right" className="w-48">
                    {format(t.txn_date)}
                  </td>
                  <td align="right">{t.amount}</td>
                  <td align="center" className="uppercase">
                    {t.type}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td>&nbsp;</td>
              </tr>
            )}
          </tbody>
        </table>
        <style jsx>{`
          td,
          th {
            /* border-bottom: 1px solid #ccc;*/
            padding: 1.5rem 1rem;
          }
          td.expanded-cell {
            padding: 0;
          }
          td.tenant > div {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        `}</style>
      </div>
    </>
  )
}
