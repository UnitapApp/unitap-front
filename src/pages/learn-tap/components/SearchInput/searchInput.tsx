import React, { useContext, useEffect, useState } from 'react';
import Icon from 'components/basic/Icon/Icon';
import Input from 'components/basic/Input/input';
import { LearnTapContext } from 'hooks/learn-tap/learnTapContext';
import { useLocation, useNavigate } from 'react-router-dom';

type SearchInputProps = {
	className?: string;
};

const SearchInput = ({ className = '' }: SearchInputProps) => {
	const { changeSearchPhrase, searchPhrase } = useContext(LearnTapContext);
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
				fontSize="12px"
				iconWidth="20px"
				iconHeight="20px"
				className="placeholder:text-gray90 !w-64"
				value={searchPhraseInput}
				onChange={searchPhraseChangeHandler}
				placeholder="Mission, Network, Token..."
				pl={7}
				p={1.5}
				mb={0}
				backgroundColor="black1"
			></Input>
		</div>
	);
};

export default SearchInput;
