import { ClaimReceipt, Chain, ClaimReceiptState } from 'types';

const getActiveClaimReciept = (activeClaimHistory: ClaimReceipt[], activeChain: Chain | null) => {
  if (!activeChain) return null;
  const verified = activeClaimHistory.filter(
    (claimReceipt: ClaimReceipt) =>
      claimReceipt.status === ClaimReceiptState.VERIFIED && claimReceipt.pk.toString() === activeChain.chainId,
  );
  const rejected = activeClaimHistory.filter(
    (claimReceipt: ClaimReceipt) =>
      claimReceipt.status === ClaimReceiptState.REJECTED && claimReceipt.pk.toString() === activeChain.chainId,
  );
  const pending = activeClaimHistory.filter(
    (claimReceipt: ClaimReceipt) =>
      claimReceipt.status === ClaimReceiptState.PENDING && claimReceipt.pk.toString() === activeChain.chainId,
  );

  if (verified.length > 0) return verified[0];
  if (pending.length > 0) return pending[0];
  if (rejected.length > 0) return rejected[0];

  return null;
};

export default getActiveClaimReciept;
