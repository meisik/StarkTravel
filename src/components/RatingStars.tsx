import React from 'react';

const RatingStars: React.FC<{ averageRating: number | null, reviewFilesCount: number }> = ({ averageRating, reviewFilesCount }) => {
  const stars: JSX.Element[] = [];

  for (let i = 1; i <= 5; i++) {
    if (averageRating && averageRating >= i) {
      stars.push(<i key={i} className="bi bi-star-fill me-1" style={{ fontSize: '2rem', color: '#ffbf00' }}></i>);
    } else if (averageRating && averageRating >= i - 0.5) {
      stars.push(<i key={i} className="bi bi-star-half me-1" style={{ fontSize: '2rem', color: '#ffbf00' }}></i>);
    } else {
      stars.push(<i key={i} className="bi bi-star me-1" style={{ fontSize: '2rem', color: '#ffbf00' }}></i>);
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="star-rating" style={{ display: 'flex', alignItems: 'center' }}>
        {stars}
        <span className="ms-2">
            <strong>
                {reviewFilesCount && reviewFilesCount > 0 ? `(${averageRating ?? 'N/A'} of 5, ${reviewFilesCount} reviews)` : '(0 reviews)'}
            </strong>
        </span>
      </div>
    </div>
  );
};

export default RatingStars;
