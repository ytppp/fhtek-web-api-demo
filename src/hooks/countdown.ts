export const useCountDown = (
  timeout: number,
  interval: number,
  doingHandle?: (countdown: number) => void,
  doneHandle?: () => void,
) => {
  let countdown = timeout
  let timer: number | null = null
  const createCountDown = () => {
    if (timer !== null) {
      return
    }
    timer = setInterval(() => {
      if (!countdown) {
        cleanCountDown()
        return
      }
      countdown -= interval
      if (doingHandle) {
        doingHandle(countdown)
      }
    }, interval)
  }
  const cleanCountDown = () => {
    if (timer !== null) {
      clearInterval(timer)
      timer = null
      if (doneHandle) {
        doneHandle()
      }
    }
  }
  return {
    createCountDown,
    cleanCountDown,
  }
}
