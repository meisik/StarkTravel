import React, { useState, useEffect } from 'react';
import { uploadCompressedPhoto } from './PhotoUploader.tsx';
import StatusModal from './StatusModal.tsx';
import WalletBar from './WalletBar.tsx';
import SignMessage from './SignMessage.tsx';
import { useAccount } from "@starknet-react/core";
import {
  checkGroupExists,
  createGroup,
  checkUserExistsInGroup,
  uploadReviewToIPFS,
  addCIDsToGroup,
  fetchAllGroups,
} from '../services/pinataService.ts';
import ReviewInputForm from './ReviewInputForm.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';

const jwt = process.env.REACT_APP_PINATA_JWT;

const ReviewForm: React.FC = () => {
  const { address } = useAccount();
  const isWalletConnected = !!address;
  const [location, setLocation] = useState<string>('');
  const [reviewText, setReviewText] = useState<string>('');
  const [photos, setPhotos] = useState<FileList | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [photoLinks, setPhotoLinks] = useState<Array<{ cid: string; name: string }>>([]);
  const [groups, setGroups] = useState<Array<{ id: string; name: string }>>([]);

  // Function to get a list of all groups
  useEffect(() => {
    const fetchGroups = async () => {
      const response = await fetchAllGroups();
      if (response && response.length > 0) {
        setGroups(response);
      } else {
        console.log('No groups found');
      }
    };

    fetchGroups();
  }, []);

  const resetForm = () => {
    setLocation('');
    setReviewText('');
    setPhotos(null);
    const fileInput = document.getElementById('photos') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setShowModal(true);
    setModalMessage('Data validation is performed...');

    try {
      let group = await checkGroupExists(location);
      if (!group) {
        group = await createGroup(location);
      }

      const userExists = await checkUserExistsInGroup(address || '', group.id);
      if (userExists) {
        setModalMessage(
          `User ${address ? `${address.substring(0, 5)}...${address.substring(address.length - 5)}` : 'Unknown'} 
          already left a feedback for the ${location} location`
        );
        setLoading(false);
        return;
      }
      
      setModalMessage('Loading data into IPFS storage...');
      
      const timestamp = new Date().toISOString();
      const reviewData = { author: address, location, reviewText, timestamp, photos: [] as string[] };

      if (photos) {
        const uploadPromises = Array.from(photos).map((photo) => uploadCompressedPhoto(photo, `${jwt}`));
        const photoData = await Promise.all(uploadPromises);
        reviewData.photos = photoData.map((photo) => photo.cid);
        setPhotoLinks(photoData);
      }

      const jsonBlob = new Blob([JSON.stringify(reviewData)], { type: 'application/json' });
      const formData = new FormData();
      formData.append('file', new File([jsonBlob], `${address}.json`));

      const cid = await uploadReviewToIPFS(formData);

      const cidsToAdd = [cid, ...reviewData.photos];
      await addCIDsToGroup(cidsToAdd, group.id);

      setModalMessage(`The data was successfully uploaded to IPFS and added to the location ${location}`);
    } 
    catch (error) {
      console.error('Error:', error);
      setModalMessage('Error loading data or adding to a group');
    }

    setLoading(false);  
  };

  return (
    <div>
      {isWalletConnected ? (
        <div>
          <ReviewInputForm
            username={address ? `0x${address}` : ''}
            location={location}
            setLocation={setLocation}
            reviewText={reviewText}
            setReviewText={setReviewText}
            photos={photos}
            setPhotos={setPhotos}
            handleSubmit={handleFormSubmit}
            isWalletConnected={isWalletConnected}
          />
        </div>
      )
      : (
        <WalletBar />
      )}

      <StatusModal
        showModal={showModal}
        loading={loading}
        modalMessage={modalMessage}
        photoLinks={photoLinks}
        handleClose={() => {
          setShowModal(false);
          resetForm();
        }}
      />
    </div>
  );
};

export default ReviewForm;