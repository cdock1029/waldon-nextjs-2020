import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogLabel,
} from '@reach/alert-dialog'
import { useState, useRef } from 'react'
import { useMutation, queryCache } from 'react-query'

function saveTenantRequest(tenant: Tenant) {
  return fetch('/api/polka/routes/tenants', {
    method: 'POST',
    body: JSON.stringify({ tenant }),
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
  }).then<{ data?: any; error?: string }>((res) => res.json())
}

export function NewTenant() {
  const [showDialog, setShowDialog] = useState(false)
  const cancelRef = useRef(null)
  const formRef = useRef<HTMLFormElement>(null)
  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)

  const [mutate] = useMutation(saveTenantRequest)

  async function saveTenant(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const {
      first_name,
      middle_name,
      last_name,
      suffix,
      email,
    } = e.target as any

    let raw = {
      first_name: first_name.value,
      middle_name: middle_name.value,
      last_name: last_name.value,
      suffix: suffix.value,
      email: email.value,
    }
    let tenant = {}
    for (let [key, val] of Object.entries(raw)) {
      if (val) {
        tenant[key] = val
      }
    }

    const result = await mutate(tenant as Tenant, {
      onSuccess: () => {
        queryCache.refetchQueries('tenants', { exact: true })
      },
    })

    if (result.error) {
      alert(result.error)
    } else if (result.data) {
      console.log({ result: result.data })
    }

    close()
  }

  function requestSubmit() {
    formRef.current?.requestSubmit()
  }
  return (
    <div>
      <button onClick={open}>New tenant</button>
      {showDialog ? (
        <AlertDialog
          onDismiss={close}
          leastDestructiveRef={cancelRef}
          className="p-8 rounded shadow-md"
        >
          <AlertDialogLabel className="pb-8">
            <h2 className="m-0">New tenant</h2>
          </AlertDialogLabel>
          <AlertDialogDescription className="pb-8">
            <form onSubmit={saveTenant} ref={formRef}>
              <label className="flex flex-col mb-4">
                First name
                <input name="first_name" required placeholder="First name" />
              </label>

              <label className="flex flex-col mb-4">
                Middle name
                <input name="middle_name" placeholder="Middle name" />
              </label>
              <label className="flex flex-col mb-4">
                Last name
                <input name="last_name" required placeholder="Last name" />
              </label>
              <label className="flex flex-col mb-4">
                Suffix
                <input name="suffix" placeholder="Suffix" />
              </label>
              <label className="flex flex-col mb-4">
                Email
                <input name="email" type="email" placeholder="Email" />
              </label>
            </form>
          </AlertDialogDescription>
          <div className="flex items-center justify-end">
            <button ref={cancelRef} onClick={close}>
              Cancel
            </button>
            <button className="ml-4" onClick={requestSubmit}>
              Save tenant
            </button>{' '}
          </div>
        </AlertDialog>
      ) : null}
    </div>
  )
}
