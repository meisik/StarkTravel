import React, {useEffect} from 'react';
import { useStarknetkitConnectModal } from 'starknetkit';
import { useConnect,useAccount, useDisconnect } from '@starknet-react/core';

const WalletBar = () => {
  const { connect, connectors } = useConnect();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors,
    modalTheme: "dark",
    modalMode: "alwaysAsk"
  });

  const formatAddress = (address) =>
    `${address.substring(0, 5)}...${address.substring(address.length - 5)}`;

  const handleConnect = async () => {
    const { connector } = await starknetkitConnectModal();
    if (connector) {
      await connect({ connector });
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.addEventListener("wallet_disconnected", async () => {
        disconnect()
        })
      }
}, [])


  return (
    <>
      {isConnected ? (
        <a onClick={() => disconnect()} className="btn btn-danger ps-3 pe-3">
          <i className="bi bi-x-circle-fill me-2"></i> Disconnect {formatAddress(address)}
        </a>
      )
      : (
        <a
        onClick={handleConnect}
        className="btn btn-success d-flex align-items-center ps-3 pe-3"
      >
        <i className="bi bi-wallet-fill me-2"></i> Connect Wallet
      </a>
      )}
    </>
  );
};

export default WalletBar;
