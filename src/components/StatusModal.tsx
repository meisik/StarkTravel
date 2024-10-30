import React from 'react';
import { Modal, Spinner, Button } from 'react-bootstrap';

interface StatusModalProps {
  showModal: boolean;
  loading: boolean;
  modalMessage: React.ReactNode;
  photoLinks: Array<{ cid: string; name: string }>;
  handleClose: () => void;
}

const StatusModal: React.FC<StatusModalProps> = ({ showModal, loading, modalMessage, photoLinks, handleClose }) => {
  
  // Reload Page 
  // const handleReload = () => {
    //   window.location.reload();
    // };
  
    return (
      <Modal show={showModal} onHide={handleClose} backdrop="static" centered>
        <Modal.Body className="d-flex flex-column justify-content-center align-items-center text-center" style={{}}>
          <h3 className="lead fw-normal mb-0">{modalMessage}</h3>
          {loading && <Spinner animation="border" role="status" className="text-primary mt-3" />}
          {!loading && photoLinks.length > 0 && (
            <div>
              <p className='text-success fw-bolder'>Uploaded photos:</p>
              {photoLinks.map((photo) => (
                <a className='success-photo' key={photo.cid} href={`https://peach-convincing-gerbil-650.mypinata.cloud/ipfs/${photo.cid}`} target="_blank" rel="noopener noreferrer">
                {photo.name}</a>
              ))}
            </div>
          )}
          {!loading && modalMessage !== "Data validation is performed" && (
            <Button variant="primary" className="mt-4" onClick={handleClose}>
              Close Modal
            </Button>
          )}
        </Modal.Body>
      </Modal>
    );
  };

export default StatusModal;