import React, { useState } from 'react';
import { uploadCompressedPhoto } from './PhotoUploader.tsx';
import StatusModal from './StatusModal.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';

const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxMTM3ZWNiNy02Y2ZiLTQ1NTMtYjRiYy02Yjg1NWI3NTUxM2YiLCJlbWFpbCI6InNlb3RvbXJ1QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI2NGVhNDc0MmIwZjI4MGFjZGFlYyIsInNjb3BlZEtleVNlY3JldCI6IjIxZWQ3NjBkNDQ1NDBhZDg3NjljMWMxMGVmNjI1ODBlN2Y2ZjlmZTgzYzNjMmY5YTI3NmQ5OTJkZTQ2NDAyYWIiLCJleHAiOjE3NTkxNjI1NTZ9._qAKlNzzI5H8tRlRrKPQcLH-D_z9bgLE1XPttaeW4_A';

// Проверка наличия группы
const checkGroupExists = async (location: string) => {
  const response = await fetch("https://api.pinata.cloud/groups", {
    headers: {
      Authorization: `Bearer ${jwt}`
    }
  });

  const data = await response.json();

  if (data && data.rows) {
    return data.rows.find((group: any) => group.name === location);
  }

  return null;
};

// Создание новой группы
const createGroup = async (location: string) => {
  const response = await fetch("https://api.pinata.cloud/groups", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: location
    })
  });

  if (!response.ok) {
    throw new Error('Не удалось создать группу');
  }

  const data = await response.json();
  if (!data.id) {
    throw new Error('Группа создана, но ID отсутствует');
  }

  return data;
};

// Проверка наличия пользователя в группе
const checkUserExistsInGroup = async (username: string, groupId: string) => {
    const response = await fetch(`https://api.pinata.cloud/data/pinList?groupId=${groupId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`,
      }
    });
  
    const contentType = response.headers.get('content-type');
    console.log('Response Content Type:', contentType);

    const responseBody = await response.text(); // Считываем ответ как текст, чтобы увидеть полные данные
    console.log('Response Body as text:', responseBody);
    
    // Проверяем, является ли ответ JSON
    if (contentType && contentType.includes('application/json')) {
        try {
          const data = JSON.parse(responseBody); // Парсим JSON вручную
          console.log('Parsed Data:', data);
      
          if (data && data.rows && Array.isArray(data.rows)) {
            for (const file of data.rows) {
                if (file.mime_type === 'application/json') { // Проверяем только JSON файлы
                    const fileResponse = await fetch(`https://peach-convincing-gerbil-650.mypinata.cloud/ipfs/${file.ipfs_pin_hash}`);
                    const fileData = await fileResponse.json();
              if (fileData.author === username) {
                return true;
              }}
            }
          }
        } catch (error) {
          console.error('Ошибка при парсинге JSON:', error);
          throw new Error('Ошибка при обработке ответа JSON');
        }
      } else {
        console.error('Unexpected content type:', contentType);
        throw new Error('Unexpected content type received, not JSON');
      }
      
      return false;
};

// Загрузка отзыва в IPFS
const uploadReviewToIPFS = async (formData: FormData) => {
  const response = await fetch(`https://api.pinata.cloud/pinning/pinFileToIPFS`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Ошибка загрузки отзыва в IPFS');
  }

  const data = await response.json();
  return data.IpfsHash; // Возвращаем CID
};

// Добавление CIDs в группу
const addCIDsToGroup = async (cids: string[], groupId: string) => {
  const response = await fetch(`https://api.pinata.cloud/groups/${groupId}/cids`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ cids })
  });

  if (!response.ok && !(response.status === 200 && response.statusText === "OK")) {
    throw new Error('Ошибка добавления CIDs в группу');
  }
};

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
        const uploadPromises = Array.from(photos).map((photo) => uploadCompressedPhoto(photo, jwt));
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
        <form className="needs-validation" noValidate onSubmit={handleFormSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Имя пользователя (кошелек)</label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <div className="invalid-feedback">Пожалуйста, введите имя пользователя.</div>
          </div>

          <div className="mb-3">
            <label htmlFor="location" className="form-label">Локация</label>
            <input
              type="text"
              className="form-control"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
            <div className="invalid-feedback">Пожалуйста, укажите локацию.</div>
          </div>

          <div className="mb-3">
            <label htmlFor="reviewText" className="form-label">Текст отзыва</label>
            <textarea
              className="form-control"
              id="reviewText"
              rows={4}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
            />
            <div className="invalid-feedback">Пожалуйста, введите текст отзыва.</div>
          </div>

          <div className="mb-3">
            <label htmlFor="photos" className="form-label">Загрузить фото (можно выбрать несколько)</label>
            <input
              type="file"
              className="form-control"
              id="photos"
              accept="image/*"
              multiple
              onChange={(e) => setPhotos(e.target.files)}
            />
          </div>

          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-primary" disabled={!username || !location || !reviewText}>Отправить отзыв</button>
          </div>
        </form>
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