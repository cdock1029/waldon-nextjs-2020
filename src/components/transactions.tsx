import styles from 'styles/transactions.module.css'
import { useQuery, useMutation } from 'react-query'
import { fetchGuard, format } from 'client'
import { Menu, MenuButton, MenuList, MenuItem } from '@reach/menu-button'
import { useState } from 'react'
import { UpdateModal } from './update-transaction-modal'

function fetchTxns(key, leaseId: number) {
  return fetchGuard<Transaction[]>(
    `/api/polka/routes/transactions?leaseId=${leaseId}`
  )
}

export function Transactions({
  leaseId,
  refetchDashboard,
}: {
  leaseId: number
  refetchDashboard: () => Promise<any>
}) {
  const { data, error, refetch: refetchTransactions } = useQuery(
    ['transactions', leaseId],
    fetchTxns
  )

  async function refetchTransactionsAndDashboard() {
    await Promise.all([refetchDashboard(), refetchTransactions()])
  }

  if (error) {
    return <div className="text-red-300">{(error as Error).message}</div>
  }

  return (
    <>
      <h2 className="py-4 m-0 font-sans text-2xl text-teal-200 text-opacity-75">
        Transactions
      </h2>
      <div className={`p-4 bg-gray-800 rounded shadow-md ${styles.txns}`}>
        <table className="w-full">
          <thead className="uppercase opacity-50">
            <tr>
              <th align="center">Date</th>
              <th align="center">Type</th>
              <th align="right">Amount</th>
              <th align="right">Balance</th>
              <th align="left">Notes</th>
              <th align="center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data ? (
              data.map((t) => (
                <tr key={t.id}>
                  <td align="center" className="w-48 font-mono">
                    {format(t.date)}
                  </td>
                  <td align="center" className="uppercase">
                    <Pill type={t.type} />
                  </td>

                  <td className="font-mono boost" align="right">
                    {t.amount}
                  </td>
                  <td className="font-mono" align="right">
                    {t.balance}
                  </td>

                  <td align="left">{t.notes}</td>
                  <td align="center">
                    <ActionsMenu
                      transaction={t}
                      refetch={refetchTransactionsAndDashboard}
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
      </div>
    </>
  )
}

function ActionsMenu({
  transaction,
  refetch,
}: {
  refetch: () => Promise<any>
  transaction: Transaction
}) {
  const [mutate] = useMutation(deleteTransaction)
  const [showModal, setShowModal] = useState<{
    transaction: Transaction
    refetch: () => Promise<any>
  } | null>(null)
  function dismiss() {
    setShowModal(null)
  }
  return (
    <>
      {showModal ? (
        <UpdateModal {...showModal} dismiss={dismiss} refetch={refetch} />
      ) : null}
      <Menu>
        <MenuButton className="flex items-center px-1 bg-transparent border-none shadow-none hover:bg-transparent hover:shadow-none">
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
            onSelect={() =>
              setShowModal({
                transaction,
                refetch,
              })
            }
          >
            Edit...
          </MenuItem>
          <MenuItem
            onSelect={async () => {
              if (confirm('Confirm: do you want to delete transation?')) {
                await mutate(transaction.id, {
                  async onSuccess() {
                    await refetch()
                  },
                })
              }
            }}
          >
            Delete...
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  )
}
function deleteTransaction(transactionId: number) {
  return fetch(`/api/polka/routes/transactions/${transactionId}`, {
    method: 'DELETE',
    credentials: 'same-origin',
  })
}

function Pill({ type }: { type: Transaction['type'] }) {
  let cn =
    'rounded-full text-xs font-semibold inline-flex justify-center items-center px-3 py-1 opacity-75 '
  if (type === 'payment') {
    cn += 'border-green-400 bg-green-200 text-green-800'
  } else if (type === 'late_fee') {
    cn += 'border-red-400 bg-red-200 text-red-800'
  } else if (type === 'rent') {
    cn += 'border-blue-400 bg-blue-200 text-blue-800'
  }

  return <div className={cn}>{type.replace('_', ' ')}</div>
}
