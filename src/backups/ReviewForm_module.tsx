import React, { useState } from 'react';
import { uploadCompressedPhoto } from './PhotoUploader.tsx';
import StatusModal from './StatusModal.tsx';
import {
  checkGroupExists,
  createGroup,
  checkUserExistsInGroup,
  uploadReviewToIPFS,
  addCIDsToGroup,
} from '../services/pinataService.ts';
import ReviewInputForm from './ReviewInputForm.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';

const jwt = process.env.REACT_APP_PINATA_JWT;

const ReviewForm: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [reviewText, setReviewText] = useState<string>('');
  const [photos, setPhotos] = useState<FileList | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [photoLinks, setPhotoLinks] = useState<Array<{ cid: string; name: string }>>([]);

  const resetForm = () => {
    setUsername('');
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
    setModalMessage('Выполняется проверка данных...');
    console.log("Проверка данных...");
    try {
        console.log("Мы зашли в try");
      let group = await checkGroupExists(location);
      if (!group) {
        group = await createGroup(location);
      }
      console.log("Проверили что такая группа уже есть");

      const userExists = await checkUserExistsInGroup(username, group.id);
      if (userExists) {
        setModalMessage(`Пользователь с именем ${username} уже оставил отзыв для локации ${location}`);
        setLoading(false);
        return;
      }

    console.log("Этап загрузки данных");
      
      setModalMessage('Загрузка данных в хранилище IPFS...');
      
      const timestamp = new Date().toISOString();
      const reviewData = { author: username, location, reviewText, timestamp, photos: [] as string[] };

      if (photos) {
        const uploadPromises = Array.from(photos).map((photo) => uploadCompressedPhoto(photo, `${jwt}`));
        const photoData = await Promise.all(uploadPromises);
        reviewData.photos = photoData.map((photo) => photo.cid);
        setPhotoLinks(photoData);
      }

      const jsonBlob = new Blob([JSON.stringify(reviewData)], { type: 'application/json' });
      const formData = new FormData();
      formData.append('file', new File([jsonBlob], `${username}_review.json`));

      const cid = await uploadReviewToIPFS(formData);

      const cidsToAdd = [cid, ...reviewData.photos];
      await addCIDsToGroup(cidsToAdd, group.id);

      setModalMessage(`Данные успешно загружены в IPFS и добавлены в локацию ${location}`);
    } 
    catch (error) {
      console.error('Ошибка:', error);
      setModalMessage('Ошибка загрузки данных или добавления в группу');
    }

    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Оставить отзыв</h1>
      <div className="card shadow-sm p-4">
        <ReviewInputForm
            username={username}
            setUsername={setUsername}
            location={location}
            setLocation={setLocation}
            reviewText={reviewText}
            setReviewText={setReviewText}
            photos={photos}
            setPhotos={setPhotos}
            handleSubmit={handleFormSubmit}
          />
      </div>

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