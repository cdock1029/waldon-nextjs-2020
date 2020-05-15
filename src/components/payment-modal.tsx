import { useState, useRef } from 'react'
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogLabel,
} from '@reach/alert-dialog'
import { useMutation, queryCache } from 'react-query'
import formatDate from 'intl-dateformat'
import { convertDateToUTC } from 'client'

type PaymentConfirmProps = {
  leaseId: number
  url: string
  tenant: string[]
  amount?: string
  property: string
  custom: boolean
  unit: string
  refetchDashboard: () => Promise<any>
  dismiss: () => void
}

type MakePaymentProps = {
  url: string
  leaseId: number
  date?: string
  amount?: string
}

async function makePayment({ url, ...rest }: MakePaymentProps) {
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rest),
    credentials: 'same-origin',
  })
}

export function PaymentModal(props: PaymentConfirmProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const dateRef = useRef<HTMLInputElement>(null)

  const [paymentAmount, setPaymentAmount] = useState(props.amount)

  const [mutate] = useMutation(makePayment)

  function requestSubmit() {
    formRef.current?.requestSubmit()
  }
  async function submitPayment(e: React.FormEvent) {
    e.preventDefault()

    const dateVal = dateRef.current?.valueAsDate!

    console.log('initial', dateVal.toString(), '\n ISO:', dateVal.toISOString())

    dateVal.setMinutes(dateVal.getMinutes() + dateVal.getTimezoneOffset())

    console.log('updated', dateVal.toString(), '\n ISO:', dateVal.toISOString())

    let paymentProps: MakePaymentProps = {
      leaseId: props.leaseId,
      amount: paymentAmount,
      date: dateVal.toISOString(),
      url: props.url,
    }

    console.log('submit', paymentProps)

    try {
      await mutate(paymentProps, {
        async onSuccess(response) {
          const result = await response.json()
          if (result.error) {
            alert(result.error)
          } else {
            await Promise.all([
              props.refetchDashboard(),
              queryCache.refetchQueries(['transactions', props.leaseId], {
                exact: true,
              }),
            ])
            props.dismiss()
          }
        },
        onError(e: any) {
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
        className="p-8 shadow-md rounded"
      >
        <AlertDialogLabel className="pb-8">
          <h2 className="m-0">Confirm payment</h2>
        </AlertDialogLabel>
        <AlertDialogDescription className="pb-8">
          <form onSubmit={submitPayment} ref={formRef}>
            <div className="flex justify-between">
              <label>
                {props.property}
                <p>{props.unit}</p>
              </label>

              <label>
                Tenant
                {props.tenant.map((t) => (
                  <p key={t}>{t}</p>
                ))}
              </label>
            </div>

            <label>
              Amount $
              <div className="flex items-center">
                {/* <div className="pr-4">$</div> */}
                <input
                  disabled={!props.custom}
                  className="flex-1"
                  required
                  placeholder="Enter amount"
                  value={paymentAmount || ''}
                  onChange={(e) => setPaymentAmount(e.target.value)}
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
        <div className="flex justify-end items-center">
          <button ref={cancelRef} onClick={props.dismiss}>
            Cancel
          </button>
          <button className="ml-4" onClick={requestSubmit}>
            Confirm
          </button>{' '}
        </div>
      </AlertDialog>
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
        label p {
          font-size: 1.5rem;
          margin: 0;
        }
      `}</style>
    </div>
  )
}
