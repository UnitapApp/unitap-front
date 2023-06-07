import React, { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import MarkDownStyles from './markdown.module.scss';

const MarkDown: FC<{ content: any }> = ({ content }) => {
  return (
    <ReactMarkdown
      className={`text-xs text-gray100 leading-7 pl-6 md:pl-16 pt-4 pr-6 text-justify pb-10 bg-gray40 ${MarkDownStyles['container']}`}
      // eslint-disable-next-line
      children={content}
    />
  );
};

export default MarkDown;
