import React, { useState } from 'react';

interface StarRatingProps {
  rating: number;
  setRating: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, setRating }) => {
  const handleStarClick = (newRating: number) => {
    setRating(newRating);
  };

  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => (
        <i
          key={index}
          className={`bi ${index < rating ? 'bi-star-fill' : 'bi-star'} me-1`}
          style={{
            cursor: 'pointer', 
            color: index < rating ? '#ffbf00' : '#ccc',
            fontSize: '2rem',
           }}
          onClick={() => handleStarClick(index + 1)}
        ></i>
      ))}
    </div>
  );
};

export default StarRating;
