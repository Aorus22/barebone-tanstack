type ConfirmModalOptions = {
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  destructive?: boolean
}

type ConfirmModalHandler = (
  message: string,
  options?: ConfirmModalOptions
) => Promise<boolean>

let confirmModalHandler: ConfirmModalHandler | undefined

export function setConfirmModalHandler(handler: ConfirmModalHandler | undefined) {
  confirmModalHandler = handler
}

export async function confirmModal(message: string, options?: ConfirmModalOptions) {
  if (!confirmModalHandler) {
    throw new Error("ConfirmModalProvider is not mounted")
  }
  return confirmModalHandler(message, options)
}
