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
  wpa2PskCcmp = 'psk2+ccmp',
  wpa2PskTkipCcmp = 'psk2+tkip+ccmp',
  wpa3SaeCcmp = 'sae',
  wpaWpa2PskCcmp = 'psk-mixed+ccmp',
  wpaWpa2PskTkipCcmp = 'psk-mixed+tkip+ccmp',
  wpa2PskWpa3SaeCcmp = 'sae-mixed',
  wpaPskCcmp = 'psk+ccmp',
  wpaPskTkipCcmp = 'psk+tkip+ccmp',
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

export const Lan1 = 'lan1'
export const Lan2 = 'lan2'
export const Lan3 = 'lan3'
export const Lan4 = 'lan4'
export const Ssid1 = 'ssid1'
export const Ssid2 = 'ssid2'
export const Ssid3 = 'ssid3'
export const Ssid4 = 'ssid4'
export const Ssidac1 = 'ssidac1'
export const Ssidac2 = 'ssidac2'
export const Ssidac3 = 'ssidac3'
export const Ssidac4 = 'ssidac4'

export const SsidText = {
  [Lan1]: 'LAN1',
  [Lan2]: 'LAN2',
  [Lan3]: 'LAN3',
  [Lan4]: 'LAN4',
  [Ssid1]: 'SSID1',
  [Ssid2]: 'SSID2',
  [Ssid3]: 'SSID3',
  [Ssid4]: 'SSID4',
  [Ssidac1]: 'SSIDAC1',
  [Ssidac2]: 'SSIDAC2',
  [Ssidac3]: 'SSIDAC3',
  [Ssidac4]: 'SSIDAC4',
}

export enum MeshRole {
  auto = '0',
  controller = '1',
  agent = '2',
}

export const encrypts = [
  {
    value: Encrypts.wpa2PskCcmp,
    text: 'WPA2-PSK(CCMP)',
  },
  {
    value: Encrypts.wpa2PskTkipCcmp,
    text: 'WPA2-PSK(TKIP+CCMP)',
  },
  {
    value: Encrypts.wpa3SaeCcmp,
    text: 'WPA3-SAE(CCMP)',
  },
  {
    value: Encrypts.wpaWpa2PskCcmp,
    text: 'WPA/WPA2-PSK(CCMP)',
  },
  {
    value: Encrypts.wpaWpa2PskTkipCcmp,
    text: 'WPA/WPA2-PSK(TKIP+CCMP)',
  },
  {
    value: Encrypts.wpa2PskWpa3SaeCcmp,
    text: 'WPA2-PSK/WPA3-SAE(CCMP)',
  },
  {
    value: Encrypts.wpaPskCcmp,
    text: 'WPA-PSK(CCMP)',
  },
  {
    value: Encrypts.wpaPskTkipCcmp,
    text: 'WPA-PSK(TKIP+CCMP)',
  },
]
