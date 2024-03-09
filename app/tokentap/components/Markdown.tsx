import ReactMarkdown from 'react-markdown';

const Markdown = ({ content, isHighlighted }: { content: string; isHighlighted?: boolean }) => {
	return (
		<ReactMarkdown
			className={`markdown text-xs text-gray100 leading-7 pl-6 md:pl-16 pt-4 pr-6 text-justify pb-10 ${
				isHighlighted ? 'bg-g-primary-low' : 'bg-gray40'
			}`}
		>
			{content}
		</ReactMarkdown>
	);
};

export default Markdown;
