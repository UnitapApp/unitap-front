import { ClaimButton } from "@/components/ui/Button/button";
import Icon from "@/components/ui/Icon";

const AddNewWalletSuccess = () => {
  return (
    <>
      <Icon iconSrc="/assets/images/modal/space-like.svg" alt="unitap like" />

      <div className="flex items-center mt-4 text-space-green">
        <p>Logged in Successfully!</p>
      </div>

      <p className="mt-3 text-sm text-center text-gray100">
        Welcome Back @karim_baqeri. Now you can go to your profile and add
        0x2377...49s2 to your account.
      </p>

      <ClaimButton
        // onClick={handleHaveBrightIdClicked}
        className="!w-full mt-8"
      >
        <p className="font-semibold">Go to Profile</p>
      </ClaimButton>
    </>
  );
};

export default AddNewWalletSuccess;
