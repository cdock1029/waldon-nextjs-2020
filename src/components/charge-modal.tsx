import styles from 'styles/txn-modal.module.css'
import { useState, useRef } from 'react'
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogLabel,
} from '@reach/alert-dialog'
import { useMutation, queryCache } from 'react-query'
import formatDate from 'intl-dateformat'

type ChargeModalProps = {
  id?: number
  leaseId: number
  url: string
  tenant: string[]
  amount?: string
  property: string
  custom: boolean
  unit: string
  refetch: () => Promise<any>
  dismiss: () => void
}

type MakeChargeProps = {
  url: string
  leaseId: number
  date?: string
  type: 'rent' | 'late_fee'
  amount?: string
}

async function makeCharge({ url, ...rest }: MakeChargeProps) {
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rest),
    credentials: 'same-origin',
  })
}

export function ChargeModal(props: ChargeModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const dateRef = useRef<HTMLInputElement>(null)

  const [chargeAmount, setChargeAmount] = useState(props.amount)

  const [mutate] = useMutation(makeCharge)

  function requestSubmit() {
    formRef.current?.requestSubmit()
  }
  async function submitPayment(e: React.FormEvent) {
    e.preventDefault()

    const type = (e.target as any).type.value
    const dateVal = dateRef.current?.valueAsDate!

    dateVal.setMinutes(dateVal.getMinutes() + dateVal.getTimezoneOffset())

    let chargeProps: MakeChargeProps = {
      leaseId: props.leaseId,
      amount: chargeAmount,
      date: dateVal.toISOString(),
      type,
      url: props.url,
    }

    console.log('submit', chargeProps)

    try {
      await mutate(chargeProps, {
        async onSuccess(response) {
          const result = await response.json()
          if (result.error) {
            alert(result.error)
          } else {
            await Promise.all([
              props.refetch(),
              queryCache.refetchQueries(['transactions', props.leaseId], {
                exact: true,
              }),
            ])
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
            onSubmit={submitPayment}
            ref={formRef}
            className={styles.txnModal}
          >
            <div className="flex justify-between">
              <label>
                <small>{props.property}</small>
                <p className="">{props.unit}</p>
              </label>

              <label>
                {props.tenant.map((t) => (
                  <p key={t}>{t}</p>
                ))}
              </label>
            </div>

            <div className="inline-flex">
              <label>
                Charge type
                <div className="inline-flex items-center justify-start">
                  <label className="radio" htmlFor="rent">
                    <input
                      required
                      type="radio"
                      name="type"
                      id="rent"
                      value="rent"
                    />
                    Rent
                  </label>

                  <label className="radio" htmlFor="late_fee">
                    <input
                      required
                      type="radio"
                      name="type"
                      id="late_fee"
                      value="late_fee"
                    />
                    Late fee
                  </label>
                </div>
              </label>
            </div>

            <label>
              Amount $
              <div className="flex items-center">
                <input
                  disabled={!props.custom}
                  className="flex-1"
                  required
                  placeholder="Enter charge amount"
                  value={chargeAmount || ''}
                  onChange={(e) => setChargeAmount(e.target.value)}
                  pattern="^[0-9]+(\.[0-9]{1,2})?$"
                />
              </div>
            </label>

            <label>
              Date
              <input
                defaultValue={formatDate(new Date(), 'YYYY-MM-DD')}
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
            Confirm charge
          </button>{' '}
        </div>
      </AlertDialog>
    </div>
  )
}
