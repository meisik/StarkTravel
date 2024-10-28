import React from 'react';
import { Link } from 'react-router-dom';

interface LocationCardProps {
  image: string;
  title: string;
  category: string;
  rating: number;
  link: string;
}

const LocationCard: React.FC<LocationCardProps> = ({ image, title, category, rating, link }) => {

  // Создаем массив из рейтинга, чтобы отобразить звезды
  const renderRating = () => {
    const stars: JSX.Element[] = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`bi ${i <= rating ? 'bi-star-fill' : 'bi-star'} me-1`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="col-lg-4 col-md-6 mb-4">
      <div className="card h-100">
        <img src={image} className="card-img-top" alt={title} />
        <div className="card-body">
          <div className="card-title-rating">
            <h5 className="card-title">{title}</h5>
            <div className="rating">{renderRating()}</div>
          </div>
          <p className="card-text">Category: {category}</p>
          <Link to={link} className="btn btn-primary mt-auto">
            View Reviews
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;
