// 修改 `handle` 参数的类型为更具体的函数类型，这里假设 `handle` 没有参数且返回值为 `void`
export const useCountDown = (
  timeout: number,
  doingHandle?: (countdown: number) => void,
  doneHandle?: () => void,
) => {
  let countdown = timeout
  let timer: number | null = null
  const createCountDown = () => {
    timer = setInterval(() => {
      if (!countdown) {
        cleanCountDown()
        return
      }
      countdown -= 1
      if (doingHandle) {
        doingHandle(countdown)
      }
    }, 1000)
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
