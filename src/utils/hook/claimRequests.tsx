const removeRequest = (claimRequests: number[], claimChainPk: number) =>
  claimRequests.filter((chainPk) => chainPk !== claimChainPk);

export default removeRequest;
