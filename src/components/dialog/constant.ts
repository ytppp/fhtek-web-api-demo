export enum DialogType {
  info = 'info',
  confirm = 'confirm',
}
export const DefaultOpt = {
  [DialogType.info]: {
    dialogType: DialogType.info,
    title: '',
    message: 'info',
    okText: 'ok',
  },
  [DialogType.confirm]: {
    dialogType: DialogType.confirm,
    title: '',
    message: 'confirm',
    okText: 'ok',
    cancelText: 'cancel',
  },
}
