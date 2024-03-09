import ReactMarkdown from "react-markdown";

const Markdown = ({
  content,
  isHighlighted,
}: {
  content: string;
  isHighlighted?: boolean;
}) => {
  return (
    <ReactMarkdown
      className={`markdown text-xs text-[#B5B5C6] leading-7 p-4 text-justify ${
        isHighlighted ? "bg-g-primary-low" : "bg-[#161623]"
      }`}
    >
      {content}
    </ReactMarkdown>
  );
};

export default Markdown;
