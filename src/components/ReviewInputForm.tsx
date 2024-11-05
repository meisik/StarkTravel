import React, { useState, useEffect } from 'react';
import { fetchAllGroups } from '../services/pinataService.ts';
import StarRating from './StarRating.tsx';

interface ReviewInputFormProps {
  username: string;
  location: string;
  setLocation: (value: string) => void;
  reviewText: string;
  setReviewText: (value: string) => void;
  photos: FileList | null;
  setPhotos: (files: FileList | null) => void;
  handleSubmit: (event: React.FormEvent) => void;
  isWalletConnected:boolean;
  rating: number;
  setRating: (rating: number) => void;
}

const ReviewInputForm: React.FC<ReviewInputFormProps> = ({
  username,
  location,
  setLocation,
  reviewText,
  setReviewText,
  photos,
  setPhotos,
  handleSubmit,
  isWalletConnected,
  rating,
  setRating,
}) => {

  const [labelText, setLabelText] = useState<string>('Check location'); // Label text for Location field
  const [isLocationDisabled, setIsLocationDisabled] = useState<boolean>(true); // To disable Location field
  const [isReviewValid, setIsReviewValid] = useState<boolean>(true); // Validation for review length

  useEffect(() => {
    const fetchAndSetLocation = async () => {
      // Step 1: Get the title from H1 element (assuming there’s only one H1 on the page)
      const locationTitle = document.querySelector('h1')?.innerText;

      if (locationTitle) {

        const normalizedLocationTitle = locationTitle.trim().toLowerCase();
        const groups = await fetchAllGroups();
        const normalizedGroups = groups.map(group => group.name?.trim().toLowerCase());
        const groupExists = normalizedGroups.includes(normalizedLocationTitle);
      
        if (groupExists) {
          setLabelText('Check location (already in base)');
        } else {
          setLabelText('Check location (will add to base)');
        }
      
        setLocation(locationTitle);
        setIsLocationDisabled(true);
      }
    };

    fetchAndSetLocation(); // Trigger on component load
  }, [setLocation]);

  // Validate review text length
  const handleReviewTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setReviewText(text);
    setIsReviewValid(text.length >= 150);
  };

  return (
    <form className="needs-validation" noValidate onSubmit={handleSubmit}>
      {isWalletConnected && (
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            required
            autoComplete='off'
            disabled
          />
          <label htmlFor="username">Check your wallet</label>
        </div>
      )}
      
      <div className="form-floating mb-3">
        <input
          type="text"
          className="form-control"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          disabled={isLocationDisabled}
          required
          autoComplete='off'
        />
        <label htmlFor="location">{labelText}</label>
      </div>

      <div className="form-floating mb-3">
        {/* <label htmlFor="reviewText" className="form-label">Enter review text, minimum 150 characters<span>*</span></label> */}
        <textarea
          className="form-control"
          id="reviewText"
          // rows={4}
          style={{height: '200px'}}
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          required
        />
        <label htmlFor="reviewText">Enter review text, minimum 150 characters<span>*</span></label>
        {/* <div className="invalid-feedback">Please enter the text of your feedback.</div> */}
        <div id="reviewHelp" className="form-text">Don't skimp on the text, everyone loves detailed reviews</div>
      </div>

      <div className="mb-3">
        <label className="form-label">Rate location<span>*</span></label>
        <StarRating rating={rating} setRating={setRating} />
        <div id="ratingHelp" className="form-text">Evaluate your journey at this location</div>
      </div>

      <div className="mb-3">
        <label htmlFor="photos" className="form-label">Upload your photos</label>
        <input
          type="file"
          className="form-control"
          id="photos"
          accept="image/*"
          multiple
          onChange={(e) => setPhotos(e.target.files)}
        />
        <div id="photosHelp" className="form-text">Multiple uploads are available. Supports jpg/png only</div>
      </div>

      <div className="d-grid gap-2">
        <button type="submit" className="btn btn-custom" disabled={!username || !location || (reviewText.length<149) || rating === 0}>Send Feedback</button>
      </div>
    </form>
  );
};

export default ReviewInputForm;