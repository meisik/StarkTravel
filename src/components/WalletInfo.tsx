import React from "react";
// import SignMessage from './SignMessage.tsx';
import { useAccount, useDisconnect } from "@starknet-react/core";

export function WalletInfo() {
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();

    // Formatting an wallet address for display
    const formatAddress = (address) =>
    `${address.substring(0, 5)}...${address.substring(address.length - 5)}`;

    if (!isConnected) {
        return null;    
    }

    return (
        <div className="d-grid gap-2 d-md-block mb-3">
            <p className="d-inline">
                <button onClick={() => disconnect()} className="btn btn-danger me-2">
                    Disconnet Wallet {formatAddress(address)}
                </button>
            </p>
        </div>
    )
}

export default WalletInfo;