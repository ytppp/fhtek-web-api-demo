export const useCountDown = (
  timeout: number,
  interval: number,
  doingHandle?: (countdown: number) => void,
  doneHandle?: () => void,
) => {
  let timer: number | null = null
  const createCountDown = () => {
    if (timer !== null) {
      return
    }
    let countdown = timeout
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
