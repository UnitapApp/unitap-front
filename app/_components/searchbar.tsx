"use client";

import { useTasks } from "@/context/TaskProvider";
import { CiSearch } from "react-icons/ci";
import Select from "@/components/ui/Select";

const highlightedColors = {
  "raffle": "bg-landing-raffle shadow-primary-button-sm border",
  "fcfs": "bg-landing-token shadow-primary-button-sm border",
  "all": "bg-transparent border",
}

const FilterButton = ({ children, onClick, value, selectedFilter }: { children: React.ReactNode, onClick: () => void; value: "all" | "raffle" | "fcfs"; selectedFilter: "all" | "raffle" | "fcfs" }) => {
  return (
    <button className={`rounded-full px-4 py-1 font-semibold ${selectedFilter === value ? highlightedColors[value] : "bg-transparent"}`} onClick={onClick}>
      {children}
    </button>
  );
};

export const Searchbar = () => {
  const { chains, selectedChain, setSelectedChain, filter, setFilter, search, setSearch } = useTasks();

  return (
    <div className="mt-28 flex h-20 items-center gap-2 rounded-full border px-5 py-3 shadow-primary-button">
      <CiSearch size={30} className="text-gray80" />
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        type="text"
        className="h-full w-full border-none bg-transparent outline-none ring-0 placeholder:text-stone-500"
        placeholder="You Can Search..."
      />
      <div className="flex items-center gap-4 text-[#000]">
        <FilterButton onClick={() => setFilter("all")} value="all" selectedFilter={filter}>All</FilterButton>
        <FilterButton onClick={() => setFilter("raffle")} value="raffle" selectedFilter={filter}>Raffle</FilterButton>
        <FilterButton onClick={() => setFilter("fcfs")} value="fcfs" selectedFilter={filter}>FCFS</FilterButton>
      </div>
      <hr className="h-6 border border-stone-300" />
      <Select
        placeholder="Select Chain"
        label="Chain"
        className="!bg-transparent w-32"
        value={selectedChain}
        onChange={(value) => {
          setSelectedChain(value);
        }}
        options={[{
          label: "All",
          value: null,
        }, ...chains.map((chain) => ({
          label: chain.chainName,
          value: chain.pk,
        }))]}
      />
    </div>
  );
};
