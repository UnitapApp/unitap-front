import { Chain, ClaimBoxState, ClaimBoxStateContainer, ClaimReceipt, ClaimReceiptState } from 'types';

const getClaimBoxState = (
  address: string | null | undefined,
  brightIdVerified: boolean,
  activeChain: Chain | null,
  activeClaimReceipt: ClaimReceipt | null,
  claimBoxStatus: ClaimBoxStateContainer,
  claimRequests: number[],
) => {
  //closed claim box
  if (!activeChain) return { status: ClaimBoxState.CLOSED, lastFailPk: null };

  //wallet not conneced
  if (!address) return { status: ClaimBoxState.WALLET_NOT_CONNECTED, lastFailPk: null };

  //wallet not conneced
  if (!brightIdVerified) return { status: ClaimBoxState.BRIGHTID_NOT_VERIFIED, lastFailPk: null };

  // verified
  if (activeClaimReceipt && activeClaimReceipt.txHash != null)
    return { status: ClaimBoxState.VERIFIED, lastFailPk: null };

  //pending
  if (activeClaimReceipt && activeClaimReceipt.status === ClaimReceiptState.PENDING)
    return { status: ClaimBoxState.PENDING, lastFailPk: claimBoxStatus.lastFailPk };

  //request
  if (claimRequests.filter((chainPk) => chainPk === activeChain.pk).length >= 1) {
    return { status: ClaimBoxState.REQUEST, lastFailPk: claimBoxStatus.lastFailPk };
  }

  //initial | initial after fail
  if (
    !activeClaimReceipt ||
    (activeClaimReceipt.status === ClaimReceiptState.REJECTED && activeClaimReceipt.pk === claimBoxStatus.lastFailPk)
  )
    return { status: ClaimBoxState.INITIAL, lastFailPk: claimBoxStatus.lastFailPk };

  //fail rejected
  if (
    activeClaimReceipt &&
    activeClaimReceipt.status === ClaimReceiptState.REJECTED &&
    activeClaimReceipt.pk !== claimBoxStatus.lastFailPk
  )
    return { status: ClaimBoxState.REJECTED, lastFailPk: claimBoxStatus.lastFailPk };

  return claimBoxStatus;
};

export default getClaimBoxState;
