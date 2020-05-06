import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogLabel,
} from '@reach/alert-dialog'
import { useState, useRef } from 'react'

export function NewTenant({
  refetchTenants,
}: {
  refetchTenants: () => Promise<any>
}) {
  const [showDialog, setShowDialog] = useState(false)
  const cancelRef = useRef(null)
  const formRef = useRef<HTMLFormElement>(null)
  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)

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

    const result = await fetch('/api/tenants', {
      method: 'POST',
      body: JSON.stringify({ tenant }),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => res.json())

    if (result.error) {
      alert(result.error)
    } else if (result.data) {
      console.log({ result: result.data })
    }

    refetchTenants()

    close()
  }

  function requestSubmit() {
    console.log('request submit')
    formRef.current?.requestSubmit()
  }
  return (
    <div>
      <button onClick={open}>New tenant</button>
      {showDialog && (
        <AlertDialog
          leastDestructiveRef={cancelRef}
          className="p-8 shadow-md rounded"
        >
          <AlertDialogLabel className="pb-8">
            <h2 className="m-0">New tenant</h2>
          </AlertDialogLabel>
          <AlertDialogDescription className="pb-8">
            <form onSubmit={saveTenant} ref={formRef}>
              <label>
                First name
                <input name="first_name" required placeholder="First name" />
              </label>

              <label>
                Middle name
                <input name="middle_name" placeholder="Middle name" />
              </label>
              <label>
                Last name
                <input name="last_name" required placeholder="Last name" />
              </label>
              <label>
                Suffix
                <input name="suffix" placeholder="Suffix" />
              </label>
              <label>
                Email
                <input name="email" type="email" placeholder="Email" />
              </label>
            </form>
          </AlertDialogDescription>
          <div className="flex justify-end items-center">
            <button ref={cancelRef} onClick={close}>
              Cancel
            </button>
            <button className="ml-4" onClick={requestSubmit}>
              Save tenant
            </button>{' '}
          </div>
        </AlertDialog>
      )}
      <style jsx>{`
        :global([data-reach-dialog-content]) {
          max-width: 28rem;
          width: 100%;
        }
        :glboal([data-reach-dialog-overlay]) {
          backdrop-filter: blur(3px);
        }
        label {
          display: flex;
          flex-direction: column;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  )
}
