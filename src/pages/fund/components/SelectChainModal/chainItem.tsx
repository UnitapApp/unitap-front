import React from 'react';
import styled from 'styled-components';
import { DV } from 'components/basic/designVariables';

import Icon from 'components/basic/Icon/Icon';
import { Text } from 'components/basic/Text/text.style';

interface ChainItemProps {
  icon: string;
  title: string;
  selected?: boolean;
  onClick: () => void;
  'data-testid'?: string;
}

const ChainItemWrapper = styled.div`
  border: 1px solid #e6e6e6;

  background: #21212c;
  border: 1px solid #11111c;
  border-radius: 12px;

  display: flex;
  padding: ${DV.sizes.basePadding * 1.5}px;
  align-items: center;

  margin-top: ${DV.sizes.basePadding * 1.5}px;

  :hover {
    cursor: pointer;
  }
`;

const ChainItem = (props: ChainItemProps) => {
  const { title, selected, icon, onClick } = props;
  return (
    <ChainItemWrapper onClick={onClick} data-testid={props['data-testid']}>
      <Icon mr={2} width="32px" iconSrc={icon}></Icon>
      <Text mb={0} mrAuto>
        {title}
      </Text>

      {selected && <Icon iconSrc="assets/images/modal/check.svg" width="13px" height="auto" mr={2} />}
    </ChainItemWrapper>
  );
};

export default ChainItem;
