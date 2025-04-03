import { FaPlusCircle } from "react-icons/fa";

export default function AddRuleButton() {
  return (
    <button className="flex w-full items-center justify-center gap-4 rounded-xl border-2 border-dashed border-[#867FEE] bg-[#867FEE1A] p-8 text-xl text-[#867FEE] transition-colors hover:bg-[#867FEE3A]">
      Add New Rule <FaPlusCircle />
    </button>
  );
}
