import { ClaimButton } from "@/components/ui/Button/button";
import Input from "@/components/ui/input";
import Image from "next/image";

const SetUsernameBody = () => {
  return (
    <div className="text-center w-full">
      <Image
        className="mx-auto"
        src="/assets/images/navbar/logo.svg"
        alt="unitap"
        height={128}
        width={112}
      />
      <p className="font-semibold mt-3">Set a username</p>
      <p className="mt-2 text-gray100 text-sm leading-6">
        This username is unique and public.
      </p>

      <div className={`search-input mt-5 relative bg-gray60 rounded-2xl`}>
        <Input
          className="text-gray100 !m-0 placeholder:text-gray90 !bg-gray60 border-gray70 border-2 rounded-2xl"
          width="100%"
          fontSize="14px"
          placeholder="Username"
          pl={2}
          p={2}
          mb={0}
        ></Input>
        <span className="icon-right text-gray90 absolute right-4 top-1/2 -translate-y-1/2 z-10">
          @
        </span>
      </div>

      <ClaimButton
        // onClick={handleHaveBrightIdClicked}
        className="!w-full mt-10"
      >
        <p className="font-semibold">Start the Journey</p>
      </ClaimButton>
    </div>
  );
};

export default SetUsernameBody;
