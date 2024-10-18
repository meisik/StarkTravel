import React, { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { Modal } from "react-bootstrap";
import logo from '../assets/logo_starknet.svg';

export function ConnectWallet() {
  const { address } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [showModal, setShowModal] = useState(false);

  const braavos_svg = process.env.REACT_APP_BRAAVOS;
  const argent_svg = process.env.REACT_APP_ARGENT;

  // Функция для закрытия и открытия модального окна
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  // Закрытие модального окна при успешном подключении кошелька
  useEffect(() => {
    if (address) {
      handleClose();
    }
  }, [address]);

  // Функция для открытия ссылки установки кошелька
  const handleInstallWallet = (connectorId) => {
    const urls = {
      braavos:
        "https://tinyurl.com/4yfnuy22",
      argent:
        "https://tinyurl.com/2mhvcawb",
    };

    window.open(urls[connectorId], "_blank");
  }

  // Форматирование адреса для отображения
  const formatAddress = (address) =>
    `${address.substring(0, 5)}...${address.substring(address.length - 5)}`;

  return (
    <div>
      {!address ? (
        <a onClick={handleShow} className="btn btn-primary mb-3">
          <img src={logo} alt="Logo" style={{ width: "24px", height: "24px", marginRight: "4px" }} /> Подключить кошелек
        </a>
      ) : (
        <div className="d-grid gap-2 d-md-flex justify-content-md-start mb-3">
          <a onClick={() => disconnect()} className="btn btn-danger mb-3">
            Отключить кошелек {formatAddress(address)}
          </a>
        </div>
      )}

      {/* Модальное окно */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Выберите кошелек</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-grid gap-2">
            {connectors.map((connector) => (
              connector.available() ? (
                <a
                  href="#"
                  key={connector.id}
                  onClick={(e) => {
                    e.preventDefault(); // предотвращаем переход по ссылке
                    connect({ connector }); // подключаем кошелек, если доступен
                  }}
                  className="btn btn-primary mb-2"
                >
                  <img
                    src={connector.id === "braavos" ? braavos_svg : argent_svg}
                    alt={`${connector.id} icon`}
                    style={{ width: "26px", height: "26px", marginRight: "16px" }}
                  />
                  Подключить {connector.name}
                </a>
              ) : (
                <a
                  href={connector.id === 'braavos' 
                    ? 'https://chromewebstore.google.com/detail/%D0%B1%D1%80%D0%B0%D0%B0%D0%B2%D0%BE%D1%81/jnlgamecbpmbajjfhmmmlhejkemejdma'
                    : 'https://chromewebstore.google.com/detail/argent-x-starknet-wallet/dlcobpjiigpikoobohmabehhmhfoodbb'}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={connector.id}
                  className="btn btn-outline-secondary mb-2"
                >
                  <img
                    src={connector.id === "braavos" ? braavos_svg : argent_svg}
                    alt={`${connector.id} icon`}
                    style={{ width: "26px", height: "26px", marginRight: "16px" }}
                  />
                  Установить {connector.name}
                </a>
              )
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ConnectWallet;
