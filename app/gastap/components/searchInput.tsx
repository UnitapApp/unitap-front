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
import Icon from "@/components/ui/Icon";

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
  const ref = useRef<HTMLInputElement>(null);

  const searchPhraseChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
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

  useEffect(() => {
    const onKeyPress = (e: KeyboardEvent) => {
      if (e.key == "/" && ref.current) {
        ref.current.focus();
      }
    };

    document.addEventListener("keyup", onKeyPress);

    return () => {
      document.removeEventListener("keyup", onKeyPress);
    };
  }, []);

  return (
    <div
      className={`search-input relative h-12 rounded-xl border-2 border-gray30 bg-gray40 ${className}`}
    >
      <Input
        ref={ref}
        data-testid="search-box"
        $icon="/quest/assets/images/modal/search-icon.svg"
        $width="100%"
        $fontSize="12px"
        $iconWidth="20px"
        $iconHeight="20px"
        value={searchPhraseInput}
        onChange={searchPhraseChangeHandler}
        placeholder="Chain name, Currency, ID"
        $pl={7}
        $p={1.5}
        className="mb-0"
        $backgroundColor="black1"
      ></Input>
      <Icon
        iconSrc="/quest/assets/images/claim/slash-icon.svg"
        hoverable
        className="icon-right absolute right-4 top-[10px] z-10"
      ></Icon>
    </div>
  );
};

export default SearchInput;
