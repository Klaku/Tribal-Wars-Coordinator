import {
  Toast,
  ToastBody,
  Toaster,
  ToastTitle,
  useId,
  useToastController,
} from '@fluentui/react-components'
import React from 'react'

interface ToastContext {
  dispatchSuccess: (title: string, body: string) => void
  dispatchError: (title: string, body: string) => void
}

const Context = React.createContext<ToastContext | null>(null)

export const useToastContext: () => ToastContext = () => {
  const ctx = React.useContext(Context)
  if (!ctx) throw new Error('Toast Context is null')
  return ctx
}

export const ToastContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const id = useId('toast-container')
  const { dispatchToast } = useToastController(id)
  const dispatchSuccess = (title: string, body: string) => {
    dispatchToast(
      <Toast>
        <ToastTitle>{title}</ToastTitle>
        <ToastBody>{body}</ToastBody>
      </Toast>,
      { intent: 'success' }
    )
  }
  const dispatchError = (title: string, body: string) => {
    dispatchToast(
      <Toast>
        <ToastTitle>{title}</ToastTitle>
        <ToastBody>{body}</ToastBody>
      </Toast>,
      { intent: 'error' }
    )
  }
  return (
    <Context.Provider value={{ dispatchSuccess, dispatchError }}>
      {children}
      <Toaster toasterId={id} position={'bottom-end'} />
    </Context.Provider>
  )
}
