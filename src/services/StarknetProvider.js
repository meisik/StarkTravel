import React from 'react';
import { constants } from "starknet";
import { InjectedConnector } from 'starknetkit/injected';
import { WebWalletConnector } from 'starknetkit/webwallet';
import { 
  ArgentMobileConnector,
 } from 'starknetkit/argentMobile';
import { mainnet, sepolia } from '@starknet-react/chains';
import { StarknetConfig, publicProvider } from '@starknet-react/core';

export function StarknetProvider({ children }) {
  const chains = [mainnet, sepolia];
  const connectors = [
    new InjectedConnector({ options: { id: "argentX" } }),
    new InjectedConnector({ options: { id: "braavos" } }),
    // ArgentMobileConnector.init({
    //   options: {
    //     url: window.location.hostname,
    //     dappName: "StarkTravel",
    //     chainId: constants.NetworkName.SN_MAIN,
    //     // projectId: '1ba6a0870c0326a749cab0f0102c8d7a'
    //   },
    // }),
    new WebWalletConnector({ url: "https://web.argent.xyz" }),
  ]

  return (
    <StarknetConfig
      chains={chains}
      provider={publicProvider()}
      connectors={connectors}
    >
      {children}
    </StarknetConfig>
  );
}
