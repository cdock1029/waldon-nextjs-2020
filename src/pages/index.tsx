import { useState } from 'react'
import { useQuery } from 'react-query'
import { format } from 'utils'
import { useAuth } from 'data/firebase'

async function fetchData(key, token: string) {
  const result = await fetch('/api/dashboard', {
    headers: { authorization: `Bearer ${token}` },
  }).then((res) => res.json())
  return result.data
}

export default function Index() {
  const { tokenResult } = useAuth()
  const { data, status, error } = useQuery<any[], [string, string]>(
    ['dashboard', tokenResult!.token],
    fetchData
  )

  if (error) {
    return <h1>{(error as any).message}</h1>
  }
  return (
    <div>
      <h2 className="flex items-baseline py-8 text-3xl">
        <span>Active leases</span>
        {status === 'loading' && <div className="ml-4">...</div>}
      </h2>
      <div className="shadow rounded bg-gray-100">
        <table className="table-auto text-sm w-full border-collapse">
          <thead className="text-gray-600 uppercase">
            <tr>
              <th></th>
              <th align="right">Unit</th>
              <th align="left">Tenants</th>
              <th align="right">Start</th>
              <th align="right">End</th>
              <th align="right">Rent</th>
              <th align="right">Balance</th>
              <th align="center">Actions</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {data &&
              data.map((lease) => (
                <tr key={lease.id} className="odd:bg-gray-200 even:bg-white">
                  <td align="center">
                    <button className="shadow text-gray-600">&#9660;</button>
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
                    <select>
                      <option value="">Action</option>
                      <option value="pay-rent">Pay rent</option>
                      <option value="pay-balance">Pay balance</option>
                      <option value="pay-custome">Pay custom...</option>
                      <option value="pay-custome">Add charge...</option>
                    </select>
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
                <button>X</button>
              </td>
              <td align="right">31-102</td>
              <td>Daffy Duck</td>
              <td align="right">{format('2019-04-01')}</td>
              <td align="right">{format('2020-04-01')}</td>
              <td align="right">$700.00</td>
              <td align="right" className="text-red-900">
                $30.00
              </td>
              <td align="center">
                <button>***</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
    </div>
  )
}
