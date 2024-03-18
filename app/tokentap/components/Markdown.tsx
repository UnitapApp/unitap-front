import { FC } from "react";
import ReactMarkdown from "react-markdown";

const Markdown: FC<{
  content: string;
  isHighlighted?: boolean;
  className?: string;
}> = ({ content, isHighlighted, className }) => {
  return (
    <ReactMarkdown
      className={`markdown p-4 text-justify text-xs leading-7 text-[#B5B5C6] ${className} ${
        isHighlighted ? "bg-g-primary-low" : "bg-[#161623]"
      }`}
    >
      {content}
    </ReactMarkdown>
  );
};

export default Markdown;
