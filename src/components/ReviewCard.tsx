import React from 'react';

interface ReviewCardProps {
  author: string;
  timestamp: string;
  reviewText: string;
  rating: number;
  photos?: string[];
  fancyboxId: string;
  isCurrentUser?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ author, timestamp, reviewText, rating, photos, fancyboxId, isCurrentUser }) => {
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("ru-RU", { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const formatAddress = (address: string) => `${address.substring(0, 5)}...${address.substring(address.length - 5)}`;

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">
          {isCurrentUser && <span className="me-2 badge bg-success">My Review</span>}
          {author ? formatAddress(author) : "Anonymous"}
        </h5>
        <div className="rating mb-2">
          {[...Array(5)].map((_, i) => (
            <i key={i} className={`bi ${i < rating ? "bi-star-fill me-1" : "bi-star me-1"}`}></i>
          ))}
        </div>
        <p className="reviews-date">Reviewed on {formatDate(timestamp)}</p>
        <p className="card-text mt-2">{reviewText}</p>

        {photos && photos.length > 0 && (
          <div className="photos mt-3">
            {photos.map((cid, i) => (
              <a 
                key={i} 
                href={`https://peach-convincing-gerbil-650.mypinata.cloud/ipfs/${cid}`} 
                data-fancybox={fancyboxId} 
                data-caption={`Photo ${i + 1}`}
              >
                <img
                  src={`https://peach-convincing-gerbil-650.mypinata.cloud/ipfs/${cid}`}
                  alt="review photo"
                  className="img-thumbnail me-2"
                  style={{ width: '200px', cursor: 'pointer' }}
                />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
