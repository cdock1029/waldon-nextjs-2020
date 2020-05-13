import { useQuery, useMutation, queryCache } from 'react-query'
import { fetchGuard, format } from 'client'
import { Menu, MenuButton, MenuList, MenuItem } from '@reach/menu-button'

function fetchTxns(key, leaseId: number) {
  return fetchGuard<Transaction[]>(
    `/api/polka/routes/transactions?leaseId=${leaseId}`
  )
}

const minRows = 2
export function Transactions({
  leaseId,
  refetchDashboard,
}: {
  leaseId: number
  refetchDashboard: () => Promise<any>
}) {
  const { data, error } = useQuery(['transactions', leaseId], fetchTxns)

  if (error) {
    return <div className="text-red-300">{(error as Error).message}</div>
  }

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
              <th align="left">Notes</th>
              <th align="center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data ? (
              data.map((t) => (
                <tr key={t.id}>
                  <td align="right" className="w-48">
                    {format(t.date)}
                  </td>
                  <td align="right">{t.amount}</td>
                  <td align="center" className="uppercase">
                    {t.type}
                  </td>
                  <td align="left">{t.notes}</td>
                  <td align="center">
                    <ActionsMenu
                      leaseId={leaseId}
                      transactionId={t.id}
                      refetchDashboard={refetchDashboard}
                    />
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

function deleteTransaction(transactionId: number) {
  return fetch(`/api/polka/routes/transactions/${transactionId}`, {
    method: 'DELETE',
    credentials: 'same-origin',
  })
}

function ActionsMenu({ transactionId, leaseId, refetchDashboard }) {
  const [mutate] = useMutation(deleteTransaction)
  return (
    <Menu>
      <MenuButton className="flex items-center px-1 border-none shadow-none bg-transparent hover:bg-transparent hover:shadow-none">
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          shapeRendering="geometricPrecision"
          style={{ color: 'currentcolor' }}
        >
          <circle cx="12" cy="12" r="1" fill="currentColor"></circle>
          <circle cx="12" cy="5" r="1" fill="currentColor"></circle>
          <circle cx="12" cy="19" r="1" fill="currentColor"></circle>
        </svg>
      </MenuButton>
      <MenuList>
        <MenuItem
          onSelect={
            () => alert('Todo: edit transaction')
            // mutate(transactionId, {
            //   async onSuccess() {
            //     await queryCache.refetchQueries(['transactions', leaseId])
            //   },
            // })
          }
        >
          Edit...
        </MenuItem>
        <MenuItem
          onSelect={async () => {
            if (confirm('Confirm: do you want to delete transation?')) {
              await mutate(transactionId, {
                async onSuccess() {
                  await Promise.all([
                    refetchDashboard(),
                    queryCache.refetchQueries(['transactions', leaseId], {
                      exact: true,
                    }),
                  ])
                },
              })
            }
          }}
        >
          Delete...
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
