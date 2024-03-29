"use client";

import Icon from "@/components/ui/Icon";
import Input from "@/components/ui/input";
import { useTokenTapContext } from "@/context/tokenTapProvider";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

type SearchInputProps = {
  className?: string;
};

const SearchInput = ({ className = "" }: SearchInputProps) => {
  const { changeSearchPhrase, searchPhrase } = useTokenTapContext();
  const [searchPhraseInput, setSearchPhraseInput] =
    useState<string>(searchPhrase);

  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

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

  const searchPhraseChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const phrase: string = event.target.value;
    setSearchPhraseInput(phrase);
    changeSearchPhrase!(phrase);
    updateURLQuery(phrase);
  };

  useEffect(() => {
    const queryParam = params.get("q");
    if (queryParam) {
      setSearchPhraseInput(queryParam);
      changeSearchPhrase!(queryParam);
    }
  }, [params, changeSearchPhrase]);

  return (
    <div
      className={`search-input relative border-gray30 border-2 bg-gray40 rounded-xl ${className}`}
    >
      <Input
        data-testid="search-box"
        $icon="/assets/images/modal/search-icon.svg"
        $width="100%"
        $fontSize="14px"
        $iconWidth="20px"
        $iconHeight="20px"
        value={searchPhraseInput}
        onChange={searchPhraseChangeHandler}
        placeholder="Token name"
        $pl={7}
        $p={1.5}
        $mb={0}
        $backgroundColor="black1"
      ></Input>
      <Icon
        iconSrc="assets/images/claim/slash-icon.svg"
        hoverable
        className="icon-right absolute right-4 top-[10px] z-10"
      ></Icon>
    </div>
  );
};

export default SearchInput;
