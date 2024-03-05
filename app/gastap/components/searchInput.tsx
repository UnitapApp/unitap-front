"use client";

import React, { useEffect, useRef, useState } from "react";

import Input from "@/components/ui/input";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useGasTapContext } from "@/context/gasTapProvider";

type SearchInputProps = {
  className?: string;
};

const SearchInput = ({ className = "" }: SearchInputProps) => {
  const [searchPhraseInput, setSearchPhraseInput] = useState<string>("");
  const { changeSearchPhrase } = useGasTapContext();

  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();

  const previousTimeout = useRef<any>(null);

  const searchPhraseChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (previousTimeout.current) clearTimeout(previousTimeout.current);
    const phrase: string = event.target.value;
    setSearchPhraseInput(phrase);
    changeSearchPhrase!(phrase);
    updateURLQuery(phrase);
  };

  const updateURLQuery = (phrase: string) => {
    const urlParams = new URLSearchParams();

    if (phrase) {
      urlParams.set("q", phrase);
    } else {
      urlParams.delete("q");
    }

    const newURL = `${pathname}?${urlParams.toString()}`;

    if (newURL === pathname) return;

    router.push(newURL);
  };

  useEffect(() => {
    const queryParam = params.get("query") ?? params.get("q") ?? "";

    setSearchPhraseInput(queryParam);
    changeSearchPhrase?.(queryParam);
  }, [params]);

  return (
    <div
      className={`search-input relative h-12 border-gray30 border-2 bg-gray40 rounded-2xl ${className}`}
    >
      <Input
        data-testid="search-box"
        $icon="/assets/images/modal/search-icon.svg"
        $width="100%"
        $fontSize="12px"
        $iconWidth="20px"
        $iconHeight="20px"
        value={searchPhraseInput}
        onChange={searchPhraseChangeHandler}
        placeholder="Chain name, Currency, ID"
        $pl={7}
        $p={1.5}
        className="mb-0 !rounded-2xl"
        $backgroundColor="black1"
      ></Input>
    </div>
  );
};

export default SearchInput;
