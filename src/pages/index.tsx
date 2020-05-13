import { useState, Fragment } from 'react'
import { useQuery } from 'react-query'
import { format, useSelectedProperty, fetchGuard } from 'client'
import { Loading, Transactions, PaymentModal, ChargeModal } from 'components'
import { Menu, MenuButton, MenuList, MenuItem } from '@reach/menu-button'

async function fetchData(key, propertyId: number) {
  return fetchGuard<DashboardLease[]>(
    `/api/polka/routes/dashboard?propertyId=${propertyId || ''}`
  )
}

const minRows = 8
const colSpan = 9
export default function Index() {
  const { property } = useSelectedProperty()
  const { data: raw, status, error, refetch } = useQuery(
    () => ['dashboard', property!.id],
    fetchData
  )
  const [expanded, setExpanded] = useState<number | null>(null)

  function toggleExpanded(id: number) {
    setExpanded((curr) => (curr === id ? null : id))
  }

  if (error) {
    return <h1>{(error as any).message}</h1>
  }

  let data = raw ?? []

  return (
    <>
      {status === 'loading' && <Loading />}
      <div className="py-8">
        <h1 className="text-3xl m-0">
          {property ? property.name : <span>&nbsp;</span>}
        </h1>
        <small className="opacity-75 font-semibold uppercase">
          Active leases
        </small>
      </div>
      <div className="shadow-lg">
        <table className="table-auto text-sm w-full border-collapse">
          <thead className="uppercase">
            <tr className="bg-gray-700">
              <th></th>
              <th align="right">Unit</th>
              <th align="left">Tenant</th>
              <th align="left">Start</th>
              <th align="left">End</th>
              <th align="right">Security deposit</th>
              <th align="right">Rent</th>
              <th align="right">Balance</th>
              <th align="center">Actions</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {data.map((lease) => (
              <Fragment key={lease.id}>
                <tr className="bg-gray-700 odd:bg-opacity-75">
                  <td align="center">
                    <button
                      onClick={() => toggleExpanded(lease.id)}
                      tabIndex={-1}
                      className="text-lg h-8 flex items-center px-1 border-none shadow-none bg-transparent hover:bg-transparent hover:shadow-none"
                    >
                      {expanded === lease.id ? (
                        <span>&#9650;</span>
                      ) : (
                        <span>&#9660;</span>
                      )}
                    </button>
                  </td>
                  <td align="right">{lease.unit}</td>
                  <td className="tenant" title={lease.tenant}>
                    <div className="select-all">{lease.tenant}</div>
                  </td>
                  <td align="left" title={format(lease.start_date, 'dddd')}>
                    {format(lease.start_date)}
                  </td>
                  <td align="left" title={format(lease.end_date, 'dddd')}>
                    {format(lease.end_date)}
                  </td>
                  <td align="right">{lease.security_deposit}</td>
                  <td align="right">{lease.rent}</td>
                  <td align="right" className="">
                    {lease.balance}
                  </td>
                  <td align="center">
                    <ActionsMenu
                      leaseId={lease.id}
                      property={property!.name}
                      unit={lease.unit}
                      tenant={lease.tenant.split(',')}
                      rent={lease.rent}
                      balance={lease.balance}
                      refetchDashboard={refetch}
                    />
                  </td>
                </tr>
                {expanded === lease.id ? (
                  <tr key="expanded" className="bg-gray-700 odd:bg-opacity-75">
                    <td className="expanded-cell" colSpan={colSpan}>
                      <Transactions leaseId={expanded} />
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            ))}
            {data.length < minRows
              ? Array(minRows - data.length)
                  .fill(0)
                  .map((_, i) => {
                    return (
                      <tr
                        key={`fill-${i}`}
                        className="bg-gray-700 odd:bg-opacity-75"
                      >
                        <td colSpan={colSpan}>
                          <div className="h-8"></div>
                        </td>
                      </tr>
                    )
                  })
              : null}
          </tbody>
        </table>
      </div>
      <style jsx>{`
        td,
        th {
          padding: 1.5rem 1rem;
        }
        td.expanded-cell {
          padding: 2.5rem 2rem 3rem 2rem;
        }
        }
        td.tenant {
          max-width: calc(15vw);
        }
        td.tenant > div {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      `}</style>
    </>
  )
}

type LeaseActionProps = {
  rent: string
  balance: string
  leaseId: number
  property: string
  unit: string
  tenant: string[]
  refetchDashboard: () => Promise<any>
}
function ActionsMenu({
  rent,
  balance,
  leaseId,
  property,
  unit,
  tenant,
  refetchDashboard,
}: LeaseActionProps) {
  const [showModal, setShowModal] = useState<{
    url: string
    amount?: string
    type: 'payment' | 'charge'
    property: string
    unit: string
    tenant: string[]
    custom: boolean
    leaseId: number
  } | null>(null)
  function dismiss() {
    setShowModal(null)
  }
  return (
    <>
      {showModal && showModal.type === 'payment' ? (
        <PaymentModal
          {...showModal}
          dismiss={dismiss}
          refetchDashboard={refetchDashboard}
        />
      ) : showModal && showModal.type === 'charge' ? (
        <ChargeModal
          {...showModal}
          dismiss={dismiss}
          refetchDashboard={refetchDashboard}
        />
      ) : null}
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
            onSelect={() => {
              setShowModal({
                leaseId,
                amount: rent,
                type: 'payment',
                custom: false,
                property,
                tenant,
                unit,
                url: '/api/polka/routes/transactions/pay_rent',
              })
            }}
          >
            Pay {rent}
          </MenuItem>
          {balance !== '$0.00' && !balance.startsWith('-') && (
            <MenuItem
              onSelect={() => {
                setShowModal({
                  leaseId,
                  amount: balance,
                  type: 'payment',
                  custom: false,
                  property,
                  tenant,
                  unit,
                  url: '/api/polka/routes/transactions/pay_balance',
                })
              }}
            >
              Pay {balance}
            </MenuItem>
          )}
          <MenuItem
            onSelect={() => {
              setShowModal({
                leaseId,
                custom: true,
                type: 'payment',
                property,
                tenant,
                unit,
                url: '/api/polka/routes/transactions/pay_custom',
              })
            }}
          >
            Pay custom...
          </MenuItem>
          <MenuItem
            onSelect={() => {
              setShowModal({
                leaseId,
                custom: true,
                type: 'charge',
                property,
                tenant,
                unit,
                url: '/api/polka/routes/transactions/charge_custom',
              })
            }}
          >
            Charge...
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  )
}
