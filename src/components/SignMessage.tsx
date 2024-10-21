import React, { useState } from 'react';
import { useNetwork, useSignTypedData } from '@starknet-react/core';
import { shortString, typedData } from "starknet";

const SignMessage: React.FC = () => {
  const { chain } = useNetwork();
  const { data, isPending, isError, isIdle, isSuccess, signTypedData } = useSignTypedData({});
  const [signedMessage, setSignedMessage] = useState<string | null>(null); // Состояние для подписанного сообщения

  // Структура TypedData для EIP-712 (скорректирована)
  const typedData = {
    domain: {
      name: 'Starknet Demo', // Название приложения
      version: '1',           // Версия
      chainId: shortString.decodeShortString(chain.id.toString()),
    },
    types: {
      StarkNetDomain: [   // Обязательно определяем тип для домена
        { name: 'name', type: 'felt' },
        { name: 'version', type: 'felt' },
        { name: 'chainId', type: 'felt' },
      ],
      Message: [{ name: 'message', type: 'felt' }], // Тип сообщения для подписи
    },
    primaryType: 'Message',
    message: {
      message: 'This is awesome text'
    },
  };

  // Обработчик отправки формы
  const handleSign = async () => {
    // e.preventDefault();
    try {
      const signature = await signTypedData(typedData); // Подписываем данные
      setSignedMessage(JSON.stringify(signature)); // Сохраняем результат
    } catch (error) {
      console.error('Error signing message:', error); // Обрабатываем ошибки
    }
  };

  return (
    <><p className='d-inline'>
          <button
              onClick={(e) => { e.preventDefault(); handleSign(); } }
              className='btn btn-primary'
              disabled={isPending}>{isPending ? "Signing..." : "Sign message"}
          </button>
      </p>
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
