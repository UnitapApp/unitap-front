import * as React from 'react';
import { WalletAddressWrapper } from './claimModal.style';
import Icon from 'components/basic/Icon/Icon';

type props = {
  editable?: boolean;
  children?: React.ReactNode;
  fontSize?: string;
};

const WalletAddress = ({ editable, children, fontSize }: props) => (
  <WalletAddressWrapper fontSize={fontSize}>
    {children}
    {editable === true && <Icon className="edit-icon" iconSrc={'edit.png'} width="16px" />}
  </WalletAddressWrapper>
);

export default WalletAddress;
