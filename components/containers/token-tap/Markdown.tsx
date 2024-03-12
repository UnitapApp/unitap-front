import { FC } from "react";
import ReactMarkdown from "react-markdown";

export type MarkdownProps = {
  content: string;
  isHighlighted?: boolean;
  className?: string;
};

const Markdown: FC<MarkdownProps> = ({ content, isHighlighted, className }) => {
  return (
    <ReactMarkdown
      className={`markdown text-xs ${className} text-gray100 leading-7 pl-6 md:pl-16 pt-4 pr-6 text-justify pb-10 ${
        isHighlighted ? "bg-g-primary-low" : "bg-gray40"
      }`}
    >
      {content}
    </ReactMarkdown>
  );
};

export default Markdown;
