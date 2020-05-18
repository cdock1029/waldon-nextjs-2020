import styles from 'styles/txn-modal.module.css'
import { useState, useRef } from 'react'
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogLabel,
} from '@reach/alert-dialog'
import { useMutation } from 'react-query'
import formatDate from 'intl-dateformat'

type UpdateModalProps = {
  transaction: Transaction
  refetch: () => Promise<any>
  dismiss: () => void
}

type MakeUpdateProps = {
  id: number
  date?: string
  amount: string
  type: string
}

async function makeUpdate(props: MakeUpdateProps) {
  const url = `/api/polka/routes/transactions/transaction_update/${props.id}`
  return fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(props),
    credentials: 'same-origin',
  })
}

export function UpdateModal(props: UpdateModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const dateRef = useRef<HTMLInputElement>(null)

  const [transactionAmount, setTransactionAmount] = useState(
    props.transaction.amount.replace(/[-\$]/g, '')
  )

  const [mutate] = useMutation(makeUpdate)

  function requestSubmit() {
    formRef.current?.requestSubmit()
  }
  async function submitUpdate(e: React.FormEvent) {
    e.preventDefault()

    const dateVal = dateRef.current?.valueAsDate!

    dateVal.setMinutes(dateVal.getMinutes() + dateVal.getTimezoneOffset())

    let updateProps: MakeUpdateProps = {
      id: props.transaction.id,
      type: props.transaction.type,
      amount: transactionAmount,
      date: dateVal.toISOString(),
    }

    console.log('submit', updateProps)

    try {
      await mutate(updateProps, {
        async onSuccess(response) {
          const result = await response.json()
          if (result.error) {
            alert(result.error)
          } else {
            await props.refetch()
            props.dismiss()
          }
        },
        onError(e: any) {
          console.log('onError')
          alert(e.message)
        },
      })
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <div>
      <AlertDialog
        key={JSON.stringify(props)}
        onDismiss={props.dismiss}
        leastDestructiveRef={cancelRef}
        className="p-8 rounded shadow-md"
      >
        <AlertDialogLabel className="pb-8">
          <h2 className="m-0">Confirm charge</h2>
        </AlertDialogLabel>
        <AlertDialogDescription className="pb-8">
          <form
            onSubmit={submitUpdate}
            ref={formRef}
            className={styles.txnModal}
          >
            <div className="inline-flex">
              <label>
                Transaction type
                <input
                  disabled
                  type="text"
                  name="type"
                  value={props.transaction.type.toUpperCase()}
                />
              </label>
            </div>

            <label>
              Amount $
              <div className="flex items-center">
                <input
                  className="flex-1"
                  required
                  placeholder="Enter transaction amount"
                  value={transactionAmount}
                  onChange={(e) => setTransactionAmount(e.target.value)}
                  pattern="^[0-9]+(\.[0-9]{1,2})?$"
                />
              </div>
            </label>

            <label>
              Date
              <input
                defaultValue={formatDate(
                  new Date(props.transaction.date),
                  'YYYY-MM-DD'
                )}
                ref={dateRef}
                type="date"
                name="date"
                required
              />
            </label>
          </form>
        </AlertDialogDescription>
        <div className="flex items-center justify-end">
          <button ref={cancelRef} onClick={props.dismiss}>
            Cancel
          </button>
          <button className="ml-4" onClick={requestSubmit}>
            Update transaction
          </button>{' '}
        </div>
      </AlertDialog>
    </div>
  )
}
