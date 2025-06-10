export const customers = {
  demo: 'demo',
  fhtek: 'fhtek',
}
export const RouterMode = {
  router: '0',
  bridge: '3',
}
export const Role = {
  super: 'root',
  admin: 'admin',
}
export const MeshRole = {
  auto: '0',
  controller: '1',
  agent: '2',
}
export const FileType = {
  config: '1',
  firmware: '4',
}
export const UploadAccept = {
  cfg: '.cfg',
  bin: '.bin',
}
export const IP = {
  IPv4: 'IPv4',
  IPv6: 'IPv6',
  mix: 'mix',
}

export const VlanMode = {
  Tag: 'TAG',
  Untag: 'UNTAG',
  Transparent: 'TRANSPARENT',
}

export const ProtocolType = {
  ALL: 'TCP/UDP',
  TCP: 'TCP',
  UDP: 'UDP',
  ICMP: 'ICMP',
}

export const EnableStatus = {
  yes: '1',
  no: '0',
}

export const ModalType = {
  add: 'add',
  edit: 'edit',
}

export const WanMode = {
  bridge: 'bridge',
  route: 'route',
}

export enum StartAndStop {
  start = 'start',
  stop = 'stop',
}

export enum Encrypts {
  none = 'none',
  wpaWpa2PskTkip = 'psk-mixed+tkip',
  wpaWpa2PskCcmp = 'psk-mixed+ccmp',
  wpaWpa2PskTkipCcmp = 'psk-mixed+tkip+ccmp',
  wpa2Wpa3PskSaeCcmp = 'sae-mixed',
  wpaPskCcmp = 'psk+ccmp',
  wpaPskTkip = 'psk+tkip',
  wpa2PskTkip = 'psk2+tkip',
  wpa3SaeCcmp = 'sae',
}

export enum WpsStatus {
  idle = 'idle',
  inProgress = 'In progress',
  configured = 'configured',
  unknown = 'unknown', // 当上述WpsStatus都不存在时，取此状态
}

export enum FilteringModes {
  blackList = '0',
  whiteList = '1',
}
