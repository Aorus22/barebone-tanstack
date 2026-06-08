import type { ServerActionResult } from "@/lib/server/server-action"

import { appToast } from "@/lib/client/toast"

type ExecuteServerActionOptions = {
  showSuccessToast?: boolean
  showErrorToast?: boolean
}

export async function executeServerAction<TData>(
  action: () => Promise<ServerActionResult<TData>>,
  options: ExecuteServerActionOptions = {}
): Promise<ServerActionResult<TData>> {
  const result = await action()

  if (result.ok) {
    if (options.showSuccessToast !== false && result.toast?.message) {
      appToast.success(result.toast.message)
    }

    return result
  }

  if (options.showErrorToast !== false && result.toast?.message) {
    appToast.error(result.toast.message)
  }

  return result
}
