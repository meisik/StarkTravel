import React, { useState, useEffect } from 'react';
import { fetchAllGroups } from '../services/pinataService.ts';

interface ReviewInputFormProps {
  username: string;
  // setUsername: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  reviewText: string;
  setReviewText: (value: string) => void;
  photos: FileList | null;
  setPhotos: (files: FileList | null) => void;
  handleSubmit: (event: React.FormEvent) => void;
  isWalletConnected:boolean;
}

const ReviewInputForm: React.FC<ReviewInputFormProps> = ({
  username,
  // setUsername,
  location,
  setLocation,
  reviewText,
  setReviewText,
  photos,
  setPhotos,
  handleSubmit,
  isWalletConnected
}) => {
  const [groups, setGroups] = useState<string[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  useEffect(() => {
    const fetchGroups = async () => {
      const fetchedGroups = await fetchAllGroups();
      setGroups(fetchedGroups.map((group: any) => group.name));
    };

    fetchGroups();
  }, []);

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setLocation(input);

    if (input) {
      const matchingGroups = groups.filter((group) =>
        group.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredGroups(matchingGroups);
      setHighlightedIndex(-1);
    } else {
      setFilteredGroups([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filteredGroups.length > 0) {
      if (e.key === 'ArrowDown') {
        setHighlightedIndex((prevIndex) =>
          prevIndex < filteredGroups.length - 1 ? prevIndex + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        setHighlightedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : filteredGroups.length - 1
        );
      } else if (e.key === 'Enter' && highlightedIndex >= 0) {
        setLocation(filteredGroups[highlightedIndex]);
        setFilteredGroups([]);
      }
    }
  };

  const handleGroupClick = (group: string) => {
    setLocation(group);
    setFilteredGroups([]); 
  };

  return (
    <form className="needs-validation" noValidate onSubmit={handleSubmit}>
      {isWalletConnected  && (
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Имя пользователя (кошелек)</label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            // onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete='off'
            disabled
          />
          <div className="invalid-feedback">Пожалуйста, введите имя пользователя.</div>
        </div>
      )}
      <div className="mb-3">
        <label htmlFor="location" className="form-label">Локация</label>
        <input
          type="text"
          className="form-control"
          id="location"
          value={location}
          onChange={handleLocationChange}
          onKeyDown={handleKeyDown} // Обработка нажатия клавиш
          required
          autoComplete='off'
        />
        <div className="invalid-feedback">Пожалуйста, укажите локацию.</div>

        {/* Отображение подсказок при наличии совпадений */}
        {filteredGroups.length > 0 && (
          <ul className="list-group">
            {filteredGroups.map((group, index) => (
              <li
                key={group}
                className={`list-group-item ${index === highlightedIndex ? 'active' : ''}`} // Подсветка выбранного элемента
                onClick={() => handleGroupClick(group)} // Обработка клика на подсказку
              >
                {group}
              </li>
            ))}
          </ul>
        )}
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