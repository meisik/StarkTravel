import React, { useState } from 'react';
import { useNetwork, useSignTypedData } from '@starknet-react/core';
import { shortString, typedData } from "starknet";

interface SignMessageProps {
  location: string;
  reviewText: string;
  address: string;
}

const SignMessage: React.FC<SignMessageProps>= ({ location, reviewText, address }) => {
  const { chain } = useNetwork();
  const { data, isPending, isError, isIdle, isSuccess, signTypedData } = useSignTypedData({});
  const [signedMessage, setSignedMessage] = useState<string | null>(null);

  const typedData = {
    domain: {
      name: 'StarkTravel',
      version: '1',
      chainId: shortString.decodeShortString(chain.id.toString()),
    },
    types: {
      StarkNetDomain: [
        { name: 'name', type: 'felt' },
        { name: 'version', type: 'felt' },
        { name: 'chainId', type: 'felt' },
      ],
      Message: [
        { name: 'user', type: 'felt' },
        { name: 'location', type: 'felt' },
        { name: 'review', type: 'felt' }
      ],
    },
    primaryType: 'Message',
    message: {
      user: address || '',
      location: location,
      review: reviewText
    },
  };

  async function handleSign() {
    try {
      const signature = await signTypedData(typedData);
      setSignedMessage(JSON.stringify(signature));
    } catch (error) {
      console.error('Error signing message:', error);
    }
  }

  return (
    <>
    {!isSuccess && (
        <p className='d-inline'>
            <button
                onClick={(e) => { e.preventDefault(); handleSign(); } }
                className='btn btn-primary'
                disabled={isPending}>{isPending ? "Signing..." : "Sign message"}
            </button>
        </p>
    )}
      <p>
        {isIdle && (
            <div className="alert alert-primary mt-3">
                <p className='mb-0'>Ready to sign message!</p>
            </div>
        )}
        {isPending && (
            <div className="alert alert-warning mt-3">
                <p className='mb-0'>Signing in process...</p>
            </div>
        )}
        {isSuccess && (
            <div className="alert alert-success mt-3">
                <p className='mb-0'>Signature successfully completed!</p>
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
        )}
        {isError && (
            <div className="alert alert-danger mt-3">
                <p className='mb-0'>There is some error in signing...try again later</p>
            </div>
        )}

        {signedMessage && (
            <div>
                <h3>Подписанное сообщение:</h3>
                <pre>{signedMessage}</pre>
            </div>
        )}
        </p></>
  );
};

export default SignMessage;
