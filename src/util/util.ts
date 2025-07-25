export function createDoingHandle(checkStatus: () => Promise<string>, cleanCountDown: () => void) {
  return () => {
    checkStatus().then((status) => {
      if (status === Status.done || status === Status.fail) {
        cleanCountDown()
        handleLogout()
      }
    })
  }
}

export function createDoneHandle(key: string) {
  return () => {
    sessionStorage.setItem(key, '0')
    loading.close()
  }
}
