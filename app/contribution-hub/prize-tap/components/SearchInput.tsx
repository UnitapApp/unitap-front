"use client";

import Input from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

type SearchInputProps = {
  className?: string;
  handleSetSearchPhrase: (str: string) => void;
};

const SearchInput = ({
  className = "",
  handleSetSearchPhrase,
}: SearchInputProps) => {
  const [searchPhraseInput, setSearchPhraseInput] = useState<string>("");
  // const { changeSearchPhrase } = useContext(ClaimContext);

  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const searchPhraseChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const phrase: string = event.target.value;
    setSearchPhraseInput(phrase);
    handleSetSearchPhrase(phrase);
    // changeSearchPhrase!(phrase);
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
    const queryParam = params.get("query") ?? params.get("q");
    if (queryParam) {
      setSearchPhraseInput(queryParam);
      handleSetSearchPhrase(queryParam);
      // changeSearchPhrase!(queryParam);
    }
  }, [params, pathname]);

  return (
    <div
      className={`search-input relative border-gray30 border-2 bg-gray40 rounded-xl ${className}`}
    >
      <Input
        data-testid="search-box"
        $icon="/search.png"
        $width="100%"
        height="40px"
        $fontSize="12px"
        $iconWidth="16px"
        $iconHeight="16px"
        value={searchPhraseInput}
        onChange={searchPhraseChangeHandler}
        placeholder="Search by title"
        $pl={7}
        $p={1.2}
        $mb={0}
        $backgroundColor="black1"
      ></Input>
    </div>
  );
};

export default SearchInput;
