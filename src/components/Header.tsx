import React from 'react';
import { useAccount } from "@starknet-react/core";
import WalletBar from './WalletBar.tsx';
import logo_starknet from '../assets/logo_starknet.svg';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {

    return (
        <>
            <nav className="navbar sticky-top navbar-expand-md navbar-light">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">
                        <img src={logo_starknet}
                            height="28px" className="d-inline-block align-text-top me-2"/>StarkTravel
                    </Link>
                    <button 
                        className="navbar-toggler" 
                        type="button" 
                        data-bs-toggle="offcanvas" 
                        data-bs-target="#offcanvasNavbar" 
                        aria-controls="offcanvasNavbar"
                        style={{ color: 'white', borderColor: 'white' }}
                    >
                        <span className="navbar-toggler-icon" style={{ filter: 'brightness(0) invert(1)' }}></span>
                    </button>

                    <div className="offcanvas offcanvas-end d-md-none" tabIndex={-1} id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                        <div className="offcanvas-header">
                            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">StarkTravel</h5>
                            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <Link className="nav-link text-dark" to="/">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link text-dark" href="https://starkgate.starknet.io" target="_blank" rel="noopener noreferrer">Bridge to Starknet</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link text-dark" href="#">StarkTravel 101</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Centered Menu for Desktop */}
                    <div className="d-none d-md-flex mx-auto">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link text-light" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-light" href="https://starkgate.starknet.io" target="_blank" rel="noopener noreferrer">Bridge to Starknet</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-light" href="#">StarkTravel 101</a>
                            </li>
                        </ul>
                    </div>
                    <WalletBar />
                </div>
            </nav>
        </>
    )

};

export default Header;