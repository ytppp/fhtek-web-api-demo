import { EnableStatus } from '@/util/constant'

// 修改 `handle` 参数的类型为更具体的函数类型，这里假设 `handle` 没有参数且返回值为 `void`
export const useDataClean = () => {
  const undefinedFlag = 'N/A'
  const defaultVal = '-'
  const cleanData = (obj: any) => {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === undefinedFlag) {
        obj[key] = ''
      }
    })
  }
  const convertBool = (flag: any) => {
    if (flag === EnableStatus.yes || flag === EnableStatus.no) {
      return flag === EnableStatus.yes
    }
    if (flag) return EnableStatus.yes
    if (!flag) return EnableStatus.no
  }
  return {
    undefinedFlag,
    defaultVal,
    cleanData,
    convertBool,
  }
}
