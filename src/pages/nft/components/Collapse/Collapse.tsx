import Icon from 'components/basic/Icon/Icon';
import React from 'react';

interface CollapseProps {
  title: string,
  icon: string,
  className?: string,
  children?: React.ReactNode,
}

const Collapse = ({ className, title, icon, children }: CollapseProps) => {
  return (
    <div className={`collapse collapse-card w-full ${className}`}>
      <div className='collapse__chiz flex items-center'>
        <Icon className='mr-7' iconSrc={icon} height="28px" width="auto" />
        <p className='title'> {title} </p>
        <Icon className='ml-auto cursor-pointer' iconSrc='assets/images/nft/nft-collapse-arrow.svg' width='14px' height='auto'/>
      </div>
      <div className='collapse__data'>
        {children}
      </div>
    </div>
  )
}

export default Collapse;