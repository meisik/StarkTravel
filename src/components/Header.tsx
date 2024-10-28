import React from 'react';
import { useAccount } from "@starknet-react/core";
import WalletBar from './WalletBar.tsx';
import WalletInfo from './WalletInfo.tsx';
import logo_starknet from '../assets/logo_starknet.svg';
import { Link } from 'react-router-dom';
// import HomePage from '../pages/HomePage.tsx';

const Header: React.FC = () => {

    const { isConnected, address } = useAccount();

    return (
        <>
            <nav className="navbar sticky-top navbar-expand-lg navbar-light">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">
                        <img src={logo_starknet}
                            height="28px" className="d-inline-block align-text-top me-2"/>StarkTravel
                    </Link>
                    <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="https://starkgate.starknet.io" 
                                target='_blank'>Bridge to Starknet</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="">Starktravel 101</a>
                            </li>
                        </ul>
                    </div>
                    {isConnected ? (
                        <WalletInfo />
                    )
                    : (
                        <WalletBar />
                    )}
                    {/* <button className="btn btn-outline-light d-flex align-items-center" type="button">
                        <i className="bi bi-wallet me-2"></i> Connect Wallet
                    </button> */}
                </div>
            </nav>
        </>
    )

};

export default Header;