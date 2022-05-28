import * as React from 'react';

type props = {
  isTrue: boolean;
  children: React.ReactNode;
};

const RenderIf = ({ isTrue, children }: props) => (
  <>
    {isTrue ? (children) : null}
  </>
);

export default RenderIf;
