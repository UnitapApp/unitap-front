import Modal from "@/components/ui/Modal/modal";
import { useTokenTapContext } from "@/context/tokenTapProvider";
import { Prize, Token } from "@/types";
import { FC } from "react";

const Sidebar: FC<{
  token: Token;
}> = ({ token }) => {
  const { currentRequirementIndex, setCurrentRequirementIndex } =
    useTokenTapContext();

  return (
    <aside className="h-full w-44 rounded-lg bg-gray20 p-2 text-sm">
      <div
        className="rounded-xl border border-gray70 bg-gray20 bg-cover bg-no-repeat p-3"
        style={{ backgroundImage: "url('/assets/images/prize-bg.png')" }}
      >
        <div className="font-bold">SPACEMAN</div>
        <p className="text-xs text-gray100">by GHOLAM</p>
        <div className="mt-3 text-xs text-gray70">Requirements</div>
      </div>

      <div className="mt-3">
        <div className="rounded-xl border-2 border-dark-space-green bg-dark-space-green/30 p-2 text-center font-semibold">
          2/5 Done
        </div>
        {token.constraints.map((constraint, index) => (
          <button
            key={index}
            className="mt-2 block w-full rounded-xl border-2 border-gray50 p-2 text-center"
          >
            {constraint.title}
          </button>
        ))}
      </div>
    </aside>
  );
};

const TokenRequirementModal: FC<{
  token: Token;
}> = ({ token }) => {
  return (
    <Modal
      isOpen={true}
      title="Double-check the Requirements"
      closeModalHandler={() => {}}
    >
      <div className="mt-5 flex h-72 items-center overflow-y-auto">
        <Sidebar token={token} />
      </div>
    </Modal>
  );
};

export default TokenRequirementModal;
