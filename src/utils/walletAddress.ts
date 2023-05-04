import {Chain, ChainType} from "../types";

export default function getCorrectAddress(chain: Chain, address: string) {
  if (chain.chainName === "XDC" && chain.chainType === ChainType.NONEVM) {
    if (address.slice(0, 2) !== '0x' || address.slice(0, 2) !== '0X' && (address.slice(0, 3) === 'xdc' || address.slice(0, 3) === 'XDC')) {
      return '0x' + address.slice(3, address.length)
    }
  }
  return address;
}
