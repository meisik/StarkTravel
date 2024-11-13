import React from 'react';
import { Link } from 'react-router-dom';

interface LocationCardProps {
  image: string;
  title: string;
  originalTitle: string;
  category: string;
  rating: number | null;
  link: string;
  isLoading: boolean;
}

const LocationCard: React.FC<LocationCardProps> = ({ image, title, originalTitle, category, rating, link, isLoading }) => {
  const renderRating = () => {
    const stars: JSX.Element[] = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = rating && rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<i key={i} className="bi bi-star-fill me-1" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<i key={i} className="bi bi-star-half me-1" />);
      } else {
        stars.push(<i key={i} className="bi bi-star me-1" />);
      }
    }
    return stars;
  };

  return (
    <div className="col-lg-4 col-md-6 mb-4">
      <div className="card h-100">
        <img src={image} className="card-img-top" alt={title} />
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <div className="card-title-rating mb-3">
            <div className="card-text">Category: {category}</div>
            <div className="rating">
              {isLoading ? (
                <div className="skeleton skeleton-stars"></div>
              ) : (
                renderRating()
              )}
            </div>
          </div>
          <Link to={link} className="btn btn-custom mt-auto" state={{ originalTitle }}>
            View Location
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;
