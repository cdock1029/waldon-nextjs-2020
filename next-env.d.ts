/// <reference types="next" />
/// <reference types="next/types/global" />

type Property = {
  id: number
  name: string
}

type Unit = {
  id: number
  name: string
}

type Tenant = {
  id: number
  created_at: string
  updated_at: string

  first_name: string
  last_name: string
  full_name: string

  middle_name?: string
  suffix?: string
  email?: string

  notes?: string
}

type Lease = {
  id: number
  created_at: string
  updated_at: string
  notes?: string

  unit_id: number
  rent: string
  balance: string
  security_deposit: string
  security_deposit_collected?: string

  start_date: string
  end_date: string
}

type Transaction = {
  id: number
  lease_id: number
  created_at: string
  updated_at: string

  date: string
  amount: string
  type: 'payment' | 'rent' | 'late_fee'
  notes?: string
}

type DashboardLease = Lease & { unit: string; tenant: string }

type TransactionModalProps = {
  url: string
  amount?: string
  type: 'payment' | 'charge'
  property: string
  unit: string
  tenant: string[]
  custom: boolean
  leaseId: number
}
