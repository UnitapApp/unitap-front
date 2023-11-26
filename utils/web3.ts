export function calculateGasMargin(value: bigint): bigint {
  const gasMarginMultiplier = BigInt(10000 + 2000)
  const gasMarginValue = (value * gasMarginMultiplier) / BigInt(10000)
  return gasMarginValue
}

export const USER_DENIED_REQUEST_ERROR_CODE = 4001
// This might happen in different situations
export const GENERIC_ERROR_CODE = -32603
export const GENERIC_ERROR_CODE_2 = -320000
export const UNRECOGNIZED_CHAIN_ERROR_CODE = [4902, GENERIC_ERROR_CODE]
