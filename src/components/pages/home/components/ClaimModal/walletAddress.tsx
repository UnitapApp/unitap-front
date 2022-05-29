import * as React from 'react';
import { WalletAddressWrapper } from './claimModal.style';
import RenderIf from 'components/basic/RenderIf/renderIf';
import Icon from 'components/basic/Icon/Icon';

type props = {
    editable?: boolean;
    children?: React.ReactNode;
    fontSize?: string;
};

const WalletAddress = ({ editable, children, fontSize }: props) => (
    <WalletAddressWrapper fontSize={fontSize}>
        {children}
        <RenderIf isTrue={editable === true}> <Icon className="edit-icon" iconSrc={'edit.png'} width="16px"></Icon> </RenderIf>
    </WalletAddressWrapper>
);

export default WalletAddress;
