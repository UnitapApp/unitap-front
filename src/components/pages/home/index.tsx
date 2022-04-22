import { Button } from 'components/basic/button';
import ChainList from './chainlist'
import React, { useState, FC } from 'react';

const Home: FC = ({ children }) => {
    const [chainList, setChainList] = useState([
        {icon: 'https://cryptologos.cc/logos/polygon-matic-logo.svg?v=022', name: 'Polygon Mainnet', chain_id: 137, symbol: 'MATIC'},
        {icon: 'https://cryptologos.cc/logos/polygon-matic-logo.svg?v=022', name: 'Polygon Mainnet', chain_id: 1, symbol: 'MATIC'},
        {icon: 'https://cryptologos.cc/logos/polygon-matic-logo.svg?v=022', name: 'Polygon Mainnet', chain_id: 7, symbol: 'MATIC'},
    ])
    console.log(chainList)
    return ( 
    <>
        <div >
            <ChainList  data={chainList} />
            <Button style={{ marginTop: '20px', padding: '1rem 1rem 0 1rem' }}>connect </Button>
        </div>

    </> 
    );
}
 
export default Home;