import { useContext } from "react"
import { ClaimButton } from "@/components/ui/Button/button"
import Icon from "@/components/ui/Icon"
import { formatWeiBalance } from "@/utils/numbers"
import { useGasTapContext } from "@/context/gasTapProvider"
import Modal from "@/components/ui/Modal/modal"

const HighGasFeeModalContent = () => {
  const { changeIsHighGasFeeModalOpen } = useGasTapContext()

  return (
    <div
      className="bright-connection-modal flex flex-col items-center justify-center pt-16"
      data-testid="brightid-modal"
    >
      <Icon
        data-testid="brightid-qr"
        className="qr-code !w-4/12 z-10 mb-20"
        iconSrc="assets/images/modal/high-gas-fee-modal-icon.svg"
      />
      <p className="text-sm font-medium text-space-green mb-4 ">
        Claim Request Submitted
      </p>
      <p className="text-sm text-gray100 mb-6 text-center">
        The Gas Fee amount is too high now, we’ll make the transaction once it
        got lower.
      </p>

      <ClaimButton
        data-testid={`high-gas-fee`}
        onClick={() => changeIsHighGasFeeModalOpen(false)}
        className="!w-full"
      >
        <p className="font-semibold">Close</p>
      </ClaimButton>
    </div>
  )
}

const HighGasFeeModal = () => {
  const {
    isHighGasFeeModalOpen,
    changeIsHighGasFeeModalOpen,
    activeChain,
    isNonEvmActive,
  } = useGasTapContext()

  const chain = activeChain

  if (!chain) return null

  return (
    <Modal
      title={`Claim ${formatWeiBalance(chain.maxClaimAmount.toString())} ${
        chain.symbol
      }`}
      size="small"
      isOpen={isHighGasFeeModalOpen}
      closeModalHandler={() => changeIsHighGasFeeModalOpen(false)}
    >
      <HighGasFeeModalContent />
    </Modal>
  )
}

export default HighGasFeeModal
