import Footer from "components/common/Footer/footer";
import Navbar from "components/common/Navbar/navbar";
import React from "react";


const About = () => {
  return (
    <>
      <Navbar />
      <div className={'unitap-body'}>
        <div
          className={
            'max-w-screen-xl m-auto flex flex-col justify-center items-center w-full py-4 px-6 lg:py-9 lg:px-20'
          }
        >
          about us
        </div>
      </div>
      <Footer />
    </>
  )
}

export default About;