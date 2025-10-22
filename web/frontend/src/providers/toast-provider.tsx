import { Toast, ToastBody, Toaster, ToastTitle, useId, useToastController } from '@fluentui/react-components'
import React, { useCallback, useMemo } from 'react'

interface ToastOptions {
  title: string
  body?: string
  intent?: 'success' | 'error' | 'info' | 'warning'
}

interface ToastContext {
  dispatchToast: (options: ToastOptions) => void
  dispatchSuccess: (title: string, body?: string) => void
  dispatchError: (title: string, body?: string) => void
}

const Context = React.createContext<ToastContext | null>(null)

export const useToastContext = (): ToastContext => {
  const ctx = React.useContext(Context)
  if (!ctx) throw new Error('Toast Context is null')
  return ctx
}

export const ToastContextProvider = ({ children }: { children: React.ReactNode }) => {
  const toasterId = useId('toast-container')
  const { dispatchToast: fluentDispatch } = useToastController(toasterId)

  const buildToast = (title: string, body?: string) => (
    <Toast>
      <ToastTitle>{title}</ToastTitle>
      {body && <ToastBody>{body}</ToastBody>}
    </Toast>
  )

  const dispatchToast = useCallback(
    ({ title, body, intent = 'info' }: ToastOptions) => {
      fluentDispatch(buildToast(title, body), { intent })
    },
    [fluentDispatch],
  )

  const dispatchSuccess = useCallback(
    (title: string, body?: string) => dispatchToast({ title, body, intent: 'success' }),
    [dispatchToast],
  )

  const dispatchError = useCallback(
    (title: string, body?: string) => dispatchToast({ title, body, intent: 'error' }),
    [dispatchToast],
  )

  const contextValue = useMemo(
    () => ({ dispatchToast, dispatchSuccess, dispatchError }),
    [dispatchToast, dispatchSuccess, dispatchError],
  )

  return (
    <Context.Provider value={contextValue}>
      {children}
      <Toaster toasterId={toasterId} position='bottom-end' />
    </Context.Provider>
  )
}
