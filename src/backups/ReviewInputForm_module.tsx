import React from 'react';

interface ReviewInputFormProps {
  username: string;
  setUsername: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  reviewText: string;
  setReviewText: (value: string) => void;
  photos: FileList | null;
  setPhotos: (files: FileList | null) => void;
  handleSubmit: (event: React.FormEvent) => void;
}

const ReviewInputForm: React.FC<ReviewInputFormProps> = ({
  username,
  setUsername,
  location,
  setLocation,
  reviewText,
  setReviewText,
  photos,
  setPhotos,
  handleSubmit
}) => {
  return (
    <form className="needs-validation" noValidate onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="username" className="form-label">Имя пользователя (кошелек)</label>
        <input
          type="text"
          className="form-control"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete='off'
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
          autoComplete='off'
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
  );
};

export default ReviewInputForm;