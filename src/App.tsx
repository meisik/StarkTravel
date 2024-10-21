import React from 'react';
import { useAccount } from "@starknet-react/core";
import WalletBar from './components/WalletBar.tsx';
import ReviewInputForm from './components/ReviewInputForm.tsx';
import ReviewForm from './components/ReviewForm.tsx';
import WalletInfo from './components/WalletInfo.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {

  const { isConnected, address } = useAccount();

  return (
    <div className="container mt-5 mb-5">
      <h1 className="text-center mb-4">Leave a feedback</h1>
      <div className="card shadow-sm p-4">
        {isConnected ? (
            <div>
              <WalletInfo />
              <ReviewForm />
            </div>
          )
          : (
            <WalletBar />
          )}
      </div>
    </div>
  )
};

export default App;