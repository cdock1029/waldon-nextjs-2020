import Router from 'next/router'
import { useQuery } from 'react-query'
import { format, useSelectedProperty } from 'client'
import { Loading, Layout } from 'components'
import { Menu, MenuButton, MenuList, MenuItem } from '@reach/menu-button'

async function fetchData() {
  const result = await fetch('/api/dashboard').then((res) => res.json())
  if (result.redirect) {
    Router.replace(result.redirect)
  }
  return result.data
}

export default function Index() {
  const { property } = useSelectedProperty()
  const { data, status, error } = useQuery<any[], string>(
    'dashboard',
    fetchData
  )

  if (error) {
    return <h1>{(error as any).message}</h1>
  }
  return (
    <Layout>
      {status === 'loading' && <Loading />}
      <div className="py-8">
        <h2 className="text-3xl m-0">
          {property ? property.name : <span>&nbsp;</span>}
        </h2>
        <small className="opacity-75 font-semibold uppercase">
          Active leases
        </small>
      </div>
      {data && (
        <div className="shadow-md rounded bg-gray-700">
          <table className="table-auto text-sm w-full border-collapse">
            <thead className="opacity-50 uppercase">
              <tr>
                <th></th>
                <th align="right">Unit</th>
                <th align="left">Tenant</th>
                <th align="right">Start</th>
                <th align="right">End</th>
                <th align="right">Rent</th>
                <th align="right">Balance</th>
                <th align="center">Actions</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {data.map((lease) => (
                <tr key={lease.id} className="odd:bg-gray-600 even:bg-white">
                  <td align="center">
                    <button tabIndex={-1} className="shadow">
                      &#9660;
                    </button>
                  </td>
                  <td align="right">{lease.unit}</td>
                  <td className="tenant" title={lease.tenant}>
                    <div className="select-all">{lease.tenant}</div>
                  </td>
                  <td align="right">{format(lease.start_date)}</td>
                  <td align="right">{format(lease.end_date)}</td>
                  <td align="right">{lease.rent}</td>
                  <td align="right">{lease.balance}</td>
                  <td align="center">
                    <ActionsMenu rent={lease.rent} balance={lease.balance} />
                  </td>
                </tr>
              ))}
              {/* <tr>
              <td colSpan={8} className="expanded-cell p-0">
                <div className="bg-green-200 p-8">
                  <table className="text-sm text-gray-800 table-auto w-full border-collapse">
                    <caption>Transactions</caption>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>2020-04-01</td>
                        <th>$500.00</th>
                        <th>RENT</th>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </td>
            </tr> */}
              {/*<tr className="last:rounded-b-sm odd:bg-gray-200 even:bg-gray-100">*/}
              <tr>
                <td align="center">
                  <button tabIndex={-1} className="shadow">
                    &#9660;
                  </button>
                </td>

                <td align="right">31-102</td>
                <td>Daffy Duck</td>
                <td align="right">{format('2019-04-01')}</td>
                <td align="right">{format('2020-04-01')}</td>
                <td align="right">$700.00</td>
                <td align="right" className="text-red-200">
                  $30.00
                </td>
                <td align="center">
                  <ActionsMenu rent={'$700.00'} balance={'$30.00'} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <style jsx>{`
        td,
        th {
          /* border-bottom: 1px solid #ccc;*/
          padding: 1.5rem 1rem;
        }
        td.expanded-cell {
          padding: 0;
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
    </Layout>
  )
}

function ActionsMenu({ rent, balance }) {
  return (
    <Menu>
      <MenuButton>
        Actions <span aria-hidden>▾</span>
      </MenuButton>
      <MenuList>
        <MenuItem onSelect={() => alert('Pay rent')}>Pay {rent}</MenuItem>
        {balance !== '$0.00' && (
          <MenuItem onSelect={() => alert('Pay balance')}>
            Pay {balance}
          </MenuItem>
        )}
        <MenuItem onSelect={() => alert('Pay custom')}>Pay custom...</MenuItem>
        <MenuItem onSelect={() => alert('Pay custom')}>Add charge...</MenuItem>
      </MenuList>
    </Menu>
  )
}
