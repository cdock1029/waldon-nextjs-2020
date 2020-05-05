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
  first_name: string
  last_name: string
  full_name: string

  middle_name?: string
  suffix?: string
  email?: string
}
