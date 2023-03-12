import React, { FC } from 'react';

import Navbar from 'components/common/Navbar/navbar';
import Content from './components/Content/content';
import Footer from 'components/common/Footer/footer';

const Fund: FC = () => {
  return (
    <>
      <Navbar />
      <Content />
      <Footer />
    </>
  );
};

export default Fund;
