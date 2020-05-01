import { useState } from 'react'
import { useQuery } from 'react-query'

async function fetchData(key) {
  const result = await fetch('/api/dashboard').then((res) => res.json())
  return result.data
}

export default function Index() {
  const { data, status, error } = useQuery<any[], string>(
    'dashboard',
    fetchData
  )

  if (error) {
    return <h1>{(error as any).message}</h1>
  }
  return (
    <div className="p-4">
      <h2 className="flex items-baseline">
        <span>Active leases</span>
        {status === 'loading' && <div className="ml-4">...</div>}
      </h2>
      <table className="text-sm text-gray-800 table-auto w-full border-collapse">
        <thead>
          <tr>
            <th></th>
            <th>Unit</th>
            <th>Tenants</th>
            <th>Start</th>
            <th>End</th>
            <th>Rent</th>
            <th>Balance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((lease) => (
              <tr key={lease.id}>
                <td align="center">
                  <button>X</button>
                </td>
                <td align="right">{lease.unit}</td>
                <td>
                  <div>{lease.tenant}</div>
                </td>
                <td>{lease.start_date}</td>
                <td>{lease.end_date}</td>
                <td align="right">{lease.rent}</td>
                <td align="right">{lease.balance}</td>
                <td align="center">
                  <button>***</button>
                </td>
              </tr>
            ))}
          <tr>
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
          </tr>
          <tr>
            <td align="center">
              <button>X</button>
            </td>
            <td align="right">31-102</td>
            <td>Daffy Duck</td>
            <td>2019-04-01</td>
            <td>2020-04-01</td>
            <td align="right">$700.00</td>
            <td align="right">$30.00</td>
            <td align="center">
              <button>***</button>
            </td>
          </tr>
        </tbody>
      </table>
      <style jsx>{`
        td,
        th {
          border: 1px solid #aaa;
          padding: 0.3rem 0.6rem;
        }
        td.expanded-cell {
          padding: 0;
        }
      `}</style>
    </div>
  )
}
