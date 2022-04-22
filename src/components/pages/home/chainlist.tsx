import React, { useState, FC } from 'react';
import styled from 'styled-components/'
import { DV } from 'components/basic/designVariables'
import { PrimaryOutlinedButton, PrimaryButton } from 'components/basic/button';



// ###### Local Styled Components 

const ChainCard = styled.div`
    display: flex;
    border-radius: ${DV.sizes.baseRadius * 1.5};
    background-color: ${DV.colors.black1};
`

// ###### Local Interfaces
interface chainObj {
    icon: string;
    name: string;
    chain_id: number;
    symbol: string;
}

const ChainList = (data: any) => {
    
    
    return ( 
        <div>
        { data.data.map((x: chainObj) => {
            return (
                <ChainCard key={x.chain_id}>
                    <img src="" alt="" />
                    <p>Polygon Mainnet</p>
                    <p><span>Chain ID</span> 13</p>
                    <p><span>Currency</span> MATIC</p>
                    <div>
                        <PrimaryButton>Claim 0.003 MATIC</PrimaryButton>
                        <PrimaryOutlinedButton>Add to MetaMask</PrimaryOutlinedButton>
                    </div>
                </ChainCard>
            )
        }) }
    </div>
          );
}


 
export default ChainList;