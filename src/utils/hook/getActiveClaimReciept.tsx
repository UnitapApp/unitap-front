import { ClaimReceipt, Chain, ClaimReceiptState } from 'types';

const getActiveClaimReciept = (activeClaimHistory: ClaimReceipt[], activeChain: Chain | null, chainType: string) => {
  if (!activeChain) return null;
  if (chainType === 'EVM') {
    const verified = activeClaimHistory.filter(
      (claimReceipt: ClaimReceipt) =>
        claimReceipt.status === ClaimReceiptState.VERIFIED && claimReceipt.chain === activeChain.pk,
    );
    const rejected = activeClaimHistory.filter(
      (claimReceipt: ClaimReceipt) =>
        claimReceipt.status === ClaimReceiptState.REJECTED && claimReceipt.chain === activeChain.pk,
    );
    const pending = activeClaimHistory.filter(
      (claimReceipt: ClaimReceipt) =>
        claimReceipt.status === ClaimReceiptState.PENDING && claimReceipt.chain === activeChain.pk,
    );

    if (verified.length > 0) return verified[0];
    if (pending.length > 0) return pending[0];
    if (rejected.length > 0) return rejected[0];

  } else if (chainType === 'NONEVM') {
    const verified = activeClaimHistory.filter(
      (claimReceipt: ClaimReceipt) =>
        claimReceipt.status === ClaimReceiptState.VERIFIED && claimReceipt.chain === activeChain.pk,
    );
    const rejected = activeClaimHistory.filter(
      (claimReceipt: ClaimReceipt) =>
        claimReceipt.status === ClaimReceiptState.REJECTED && claimReceipt.chain === activeChain.pk,
    );
    const pending = activeClaimHistory.filter(
      (claimReceipt: ClaimReceipt) =>
        claimReceipt.status === ClaimReceiptState.PENDING && claimReceipt.chain === activeChain.pk,
    );

    if (verified.length > 0) return verified[0];
    if (pending.length > 0) return pending[0];
    if (rejected.length > 0) return rejected[0];
  }
  return null;
};

export default getActiveClaimReciept;
