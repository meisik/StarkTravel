import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useAccount } from "@starknet-react/core";
import ReviewForm from '../components/ReviewForm.tsx';
import WalletBar from '../components/WalletBar.tsx';
import ReviewCard from '../components/ReviewCard.tsx';
import Carousel from '../components/LocationCarousel.tsx';
import { 
    fetchLocationReviews,
    fetchGroupIdByLocation,
    fetchLocationInfo 
} from '../services/pinataService.ts';
import RatingStars from '../components/RatingStars.tsx';
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

interface Review {
  author: string;
  timestamp: string;
  reviewText: string;
  rating: number;
  photos?: string[];
}

const LocationPage: React.FC = () => {
  const location = useLocation();
  const { isConnected, address } = useAccount();
  const [reviews, setReviews] = useState<any[]>([]);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [reviewFilesCount, setReviewFilesCount] = useState<number>(0);
  const [visibleReviewsCount, setVisibleReviewsCount] = useState<number>(2);
  const [isLoadingReviews, setIsLoadingReviews] = useState<boolean>(true);
  const [isLoadingInfo, setIsLoadingInfo] = useState<boolean>(true);
  const [isLoadingCarousel, setIsLoadingCarousel] = useState<boolean>(true);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [isLoadingRating, setIsLoadingRating] = useState<boolean>(true);
  const [userHasReview, setUserHasReview] = useState<boolean>(false);
  const { locationName } = useParams<{ locationName: string }>();
  const formattedTitle = locationName?.replace(/-/g, ' ');
  const [locationInfo, setLocationInfo] = useState<{ 
    name?: string; 
    description?: 
    string; address?: 
    string; website?: 
    string; phone?: 
    string; email?: 
    string; photos?: 
    string[] } | null> (null);

  useEffect(() => {
    const loadGroupId = async () => {
        if (!formattedTitle) return;
        try {
            const id = await fetchGroupIdByLocation(formattedTitle);
            setGroupId(id);
        } catch (error) {
            console.error("Error with Group ID:", error);
        }
    };

    loadGroupId();
  }, [formattedTitle]);

  useEffect(() => {
    const loadReviews = async () => {
      if (!groupId) return;
      setIsLoadingReviews(true);

      try {
        const reviewFiles = await fetchLocationReviews(groupId);
        setReviewFilesCount(reviewFiles.length);

        const reviewData = await Promise.all(
          reviewFiles.map(async (file: any) => {
            const response = await fetch(`https://peach-convincing-gerbil-650.mypinata.cloud/ipfs/${file.ipfs_pin_hash}`);
            if (!response.ok) return null;
            const data = await response.json();
            return data;
          })
        );

        const validReviews = reviewData.filter((review) => review !== null) as Review[];
        const userReviewIndex = validReviews.findIndex(review => review.author === address);
        if (userReviewIndex !== -1) {
          const [userReview] = validReviews.splice(userReviewIndex, 1);
          validReviews.unshift(userReview);
          setUserHasReview(true);
        } else {
          setUserHasReview(false);
        }

        setReviews(validReviews);
        const totalRating = validReviews.reduce((sum, review) => sum + review.rating, 0);
        const avgRating = totalRating / validReviews.length;
        setAverageRating(Number(avgRating.toFixed(1)));
      } catch (error) {
        console.error("Error loading reviews:", error);
      } finally {
        setIsLoadingReviews(false);
        setIsLoadingRating(false);
      }
    };

    loadReviews();
  }, [groupId, address]);

  useEffect(() => {
    const loadLocationInfo = async () => {
      if (!groupId) return;
      try {
        const info = await fetchLocationInfo(groupId);
        if (info && info.photos) {
          const photoUrls = info.photos.map((cid: string) => `https://peach-convincing-gerbil-650.mypinata.cloud/ipfs/${cid}`);
          setLocationInfo({ ...info, photos: photoUrls });
        } else {
          setLocationInfo(info);
        }
      } catch (error) {
        console.error("Error fetching location info:", error);
      } finally {
        setIsLoadingInfo(false);
        setIsLoadingCarousel(false);
      }
    };
    loadLocationInfo();
  }, [groupId]);

  useEffect(() => {
    if (locationInfo?.name) {
      document.title = locationInfo.name;
    }
  }, [locationInfo?.name]);

  const handleLoadMore = () => setVisibleReviewsCount((prev) => prev + 2);

  return (
    <div className="container my-4">
      <header className="location-header">
        {isLoadingInfo ? (
            <div className="skeleton mx-auto" style={{ width: '100%', height: '400px' }}></div>
        ) : (
            <Carousel images={locationInfo?.photos || []} />
        )}
        <h1 className="mt-3">
          {isLoadingInfo ? (
            <div className="skeleton mx-auto" style={{ width: '300px', height: '40px' }}></div>
          ) : (
            locationInfo?.name || 'Location'
          )}
        </h1>
        {isLoadingRating ? (
            <>
                <div className="skeleton mx-auto" style={{ width: '300px', height: '24px'}}></div>
                <div className="skeleton mx-auto mt-3" style={{ width: '100%', height: '90px'}}></div>
            </>
        ) : (
          <div className="rating">
            <RatingStars averageRating={averageRating} reviewFilesCount={reviewFilesCount} />
          </div>
        )}
        {locationInfo && (
            <div className="location-details mt-3 mb-4">
                <p>{locationInfo.description}</p>
                <hr />
                {locationInfo.address && (
                    <p>
                    <i className="bi bi-geo-alt me-2"></i>
                    <a href="" target="_blank" rel="noopener noreferrer">
                        {locationInfo.address}
                    </a>
                    </p>
                )}
                {locationInfo.website && (
                    <p className="d-inline me-4">
                    <a href={locationInfo.website} target="_blank" rel="noopener noreferrer">
                        <i className="bi bi-globe me-2"></i>Visit website
                    </a>
                    </p>
                )}
                {locationInfo.phone && (
                    <p className="d-inline me-4">
                    <a href={`tel:${locationInfo.phone}`}>
                        <i className="bi bi-telephone me-2"></i>
                        {locationInfo.phone}
                    </a>
                    </p>
                )}
                {locationInfo.email && (
                    <p className="d-inline">
                    <a href={`mailto:${locationInfo.email}`}>
                        <i className="bi bi-envelope me-2"></i>
                        E-mail
                    </a>
                    </p>
                )}
                <hr />
            </div>
        )}

      </header>

      {isLoadingInfo ? (
        <div className="skeleton mx-auto mt-3" style={{ width: '100%', height: '200px' }}></div>
      ) : (
        <section className='review-section'>
            {isConnected ? (
                !userHasReview ? (
                <ReviewForm locationName={locationInfo?.name || ''} />
                ) : (
                <div className="alert alert-success" role="alert">
                    <h4 className="alert-heading">You're awesome!</h4>
                    <p>You have already left a review for this location, you can view it just below.</p>
                    <hr />
                    <p className="mb-0">We're sure there are more incredible places near you to write a review on as well.</p>
                </div>
                )
                ) : (
                <>
                    <div className="alert alert-danger" role="alert">
                    If you want to write a review you need connect Starknet wallet first.
                    </div>
                    <WalletBar />
                </>
                )
            }

            <h2 className="mt-5">{locationInfo?.name} reviews</h2>

            {isLoadingReviews ? (
            <div className="text-center mt-4">
                <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
                </div>
            </div>
            ) : (
                reviewFilesCount === 0 ? (
                    <div className="alert alert-primary my-4" role="alert">
                        There are no reviews yet. Be the first to leave a review!
                    </div>
                ) : (
                <>
                    <p className="review-count">Showing {Math.min(visibleReviewsCount, reviewFilesCount)} of {reviewFilesCount} reviews</p>
                    <div className="review-list mt-4">
                    {reviews.slice(0, visibleReviewsCount).map((review, index) => (
                        <ReviewCard key={index} {...review} fancyboxId={`gallery-${index}`} isCurrentUser={review.author === address} />
                    ))}
                    {visibleReviewsCount < reviews.length && (
                        <div className="text-center mt-4">
                        <button className="btn btn-custom ps-3 pe-3" onClick={handleLoadMore}>
                            <i className="bi bi-plus-circle-fill me-2"></i> Load more
                        </button>
                        </div>
                    )}
                    </div>
                </>
                )
            )}
        </section>
      )}
    </div>
  );
};

Fancybox.bind('[data-fancybox]', {});

export default LocationPage;