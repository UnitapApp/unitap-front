import { ClaimButton } from "@/components/ui/Button/button";
import Icon from "@/components/ui/Icon";

const AddNewWalletFailed = () => {
  return (
    <>
      <Icon iconSrc="/assets/images/modal/unitap-error.svg" alt="error" />

      <div className="flex items-center mt-4 text-error">
        <p>We didn’t recognize your wallet!</p>
      </div>

      <p className="mt-3 text-sm text-center text-gray100">
        There seems to be no Unitap account with the wallet (0x8753...34h6).
      </p>

      <ClaimButton className="!w-full mt-8">
        <p className="font-semibold">Go Back</p>
      </ClaimButton>
    </>
  );
};

export default AddNewWalletFailed;
