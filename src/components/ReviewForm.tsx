import React, { useState, useEffect } from 'react';
import { uploadCompressedPhoto } from './PhotoUploader.tsx';
import StatusModal from './StatusModal.tsx';
import WalletBar from './WalletBar.tsx';
import { useAccount, useNetwork, useSignTypedData } from "@starknet-react/core";
import { shortString, typedData } from "starknet";
import {
  checkGroupExists,
  createGroup,
  checkUserExistsInGroup,
  uploadReviewToIPFS,
  addCIDsToGroup,
  fetchAllGroups,
} from '../services/pinataService.ts';
import ReviewInputForm from './ReviewInputForm.tsx';
import StarRating from './StarRating.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';

const jwt = process.env.REACT_APP_PINATA_JWT;

const ReviewForm: React.FC = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data, isPending, isError, isIdle, isSuccess, signTypedDataAsync } = useSignTypedData({});
  const [signedMessage, setSignedMessage] = useState<string | null>(null);
  const isWalletConnected = !!address;
  const [location, setLocation] = useState<string>('');
  const [reviewText, setReviewText] = useState<string>('');
  const [photos, setPhotos] = useState<FileList | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<React.ReactNode>(null);
  const [photoLinks, setPhotoLinks] = useState<Array<{ cid: string; name: string }>>([]);
  const [groups, setGroups] = useState<Array<{ id: string; name: string }>>([]);
  const [isUploadSuccessful, setIsUploadSuccessful] = useState<boolean>(false);

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
    // setLocation('');
    setReviewText('');
    setPhotos(null);
    setRating(0);
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
    setIsUploadSuccessful(false);

    try {
      let group = await checkGroupExists(location); 
      if (!group) {
        group = await createGroup(location);
      }

      const userExists = await checkUserExistsInGroup(address || '', group.id);
      if (userExists) {
        setModalMessage(<p className="text-danger mb-0">
    {`User ${address ? `${address.substring(0, 5)}...${address.substring(address.length - 5)}` : 'Unknown'} 
    already left a feedback for the ${location} location`}
  </p>);
        setLoading(false);
        return;
      }

      // Function for converting a string into a `felt` array
      function stringToFeltArray(text: string): number[] {
        const feltArray: number[] = []; // Explicitly specifying the array type as `number[]`
        for (let i = 0; i < text.length; i++) {
          // Get the ASCII code of each character and add it to the array
          feltArray.push(text.charCodeAt(i));
        }
        return feltArray;
      }

      // Function to recover a string from the `felt array`
      function feltArrayToString(feltArray: number[]): string {
        return feltArray.map((felt) => String.fromCharCode(felt)).join('');
      }

      const reviewAsFeltArray = stringToFeltArray(reviewText);

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
            { name: 'rating', type: 'felt' },
            { name: 'review', type: 'felt*' },
          ],
        },
        primaryType: 'Message',
        message: {
          user: address || '',
          location: location,
          rating: rating,
          review: reviewAsFeltArray
        },
      };

      try {
        const result = await signTypedDataAsync(typedData);
        
        if (result) {
          setModalMessage('Loading data into IPFS storage...');

          const timestamp = new Date().toISOString();
          const reviewData = { author: address, location, reviewText, timestamp, rating, photos: [] as string[] };

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

          setModalMessage(
            <p className="text-success mb-4">
              The data was successfully uploaded to IPFS and added to the location {location}
            </p>
          );
          setIsUploadSuccessful(true);
        }
      } catch (error) {
        console.error('Signature Error:', error);
        setModalMessage(
        <p className="text-danger mb-0">Signature failed or user rejected! Please try again.</p>
        );
      }
    } catch (error) {
      console.error('Error:', error);
      setModalMessage('Error loading data or adding to a group');
    }

    setLoading(false);  
  };

  const handleModalClose = () => {
    setShowModal(false);
    if (isUploadSuccessful) {
      resetForm();
    }
  };

  return (
    <div>
      {isWalletConnected ? (
        <>
          <ReviewInputForm
            username={address ? `${address}` : ''}
            location={location}
            setLocation={setLocation}
            reviewText={reviewText}
            setReviewText={setReviewText} 
            photos={photos}
            setPhotos={setPhotos}
            handleSubmit={handleFormSubmit}
            isWalletConnected={isWalletConnected}
            rating={rating}
            setRating={setRating} />
        </>
      )
      : (
        <WalletBar />
      )}

      <StatusModal
        showModal={showModal}
        loading={loading}
        modalMessage={modalMessage}
        photoLinks={photoLinks}
        handleClose={handleModalClose} // handleClose is passed only to StatusModal
      />
    </div>
  );
};

export default ReviewForm;