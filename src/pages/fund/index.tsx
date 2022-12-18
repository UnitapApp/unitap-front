import React, { FC } from 'react';

import Navbar from 'components/common/Navbar/navbar';
import Content from './components/Content/content';
import Header from './components/Header/header';
import Footer from 'components/common/Footer/footer';

const Fund: FC = () => {
  return (
    <>
      <Navbar />
      <div className={'unitap-body'}>
        <Content />
      </div>
      <Footer />
    </>
  );
};

export default Fund;
