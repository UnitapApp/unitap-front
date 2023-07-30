import React, { useContext, useEffect, useState } from 'react';
import Icon from 'components/basic/Icon/Icon';
import Input from 'components/basic/Input/input';
import { TokenTapContext } from 'hooks/token-tap/tokenTapContext';
import { useLocation, useNavigate } from 'react-router-dom';

type SearchInputProps = {
	className?: string;
};

const SearchInput = ({ className = '' }: SearchInputProps) => {
	const { changeSearchPhrase, searchPhrase } = useContext(TokenTapContext);
	const [searchPhraseInput, setSearchPhraseInput] = useState<string>(searchPhrase);

	const location = useLocation();
	const navigate = useNavigate();

	const updateURLQuery = (phrase: string) => {
		const urlParams = new URLSearchParams();

		if (phrase) {
			urlParams.set('q', phrase);
		} else {
			urlParams.delete('q');
		}

		const newURL = `${location.pathname}?${urlParams.toString()}`;

		if (newURL === location.pathname) return;

		navigate(newURL);
	};

	const searchPhraseChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const phrase: string = event.target.value;
		setSearchPhraseInput(phrase);
		changeSearchPhrase!(phrase);
		updateURLQuery(phrase);
	};

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const queryParam = urlParams.get('q');
		if (queryParam) {
			setSearchPhraseInput(queryParam);
			changeSearchPhrase!(queryParam);
		}
	}, [location.search, changeSearchPhrase]);

	return (
		<div className={`search-input relative border-gray30 border-2 bg-gray40 rounded-xl ${className}`}>
			<Input
				data-testid="search-box"
				icon="search.png"
				width="100%"
				fontSize="14px"
				iconWidth="20px"
				iconHeight="20px"
				value={searchPhraseInput}
				onChange={searchPhraseChangeHandler}
				placeholder="Token name"
				pl={7}
				p={1.5}
				mb={0}
				backgroundColor="black1"
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
