import React, { useEffect, useState } from 'react';
import { useAccount } from "@starknet-react/core";
import ReviewForm from '../components/ReviewForm.tsx';
import WalletBar from '../components/WalletBar.tsx';
import ReviewCard from '../components/ReviewCard.tsx';
import { fetchLocationReviews, fetchGroupIdByLocation } from '../services/pinataService.ts';
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import RatingStars from '../components/RatingStars.tsx';

interface Review {
  author: string;
  timestamp: string;
  reviewText: string;
  rating: number;
  photos?: string[];
}

const Page1: React.FC = () => {

  const { isConnected, address } = useAccount();
  const [pageTitle, setPageTitle] = useState("");
  const [reviews, setReviews] = useState<any[]>([]);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [reviewFilesCount, setReviewFilesCount] = useState<number>(0);
  const [visibleReviewsCount, setVisibleReviewsCount] = useState<number>(2);
  const [isLoadingReviews, setIsLoadingReviews] = useState<boolean>(true);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [isLoadingRating, setIsLoadingRating] = useState<boolean>(true);

  // useEffect(() => {
  //   const heading = document.querySelector("h1");
  //   if (heading) {
  //     const headingText = heading.innerText;
  //     setPageTitle(headingText);
  //     document.title = headingText;
  //   }
  // }, [pageTitle]);

  useEffect(() => {
    const locationElement = document.querySelector('h1');
    if (locationElement) {
      setLocationName(locationElement.innerText);
      // console.log("Location name:", locationElement.innerText);
    } else {
      console.warn("<h1> not found");
    }
  }, []);

  useEffect(() => {
    const loadGroupId = async () => {
      if (!locationName) return;

      // console.log(`Call fetchGroupIdByLocation for location "${locationName}"`);
      try {
        const id = await fetchGroupIdByLocation(locationName);
        setGroupId(id);
        // console.log(`Group ID for location "${locationName}":`, id);
      } catch (error) {
        console.error("Error with Group ID:", error);
      }
    };

    loadGroupId();
  }, [locationName]);

  useEffect(() => {
    const loadReviews = async () => {
      if (!groupId) return;

      setIsLoadingReviews(true);

      try {
        // console.log(`Upload review for groupId: ${groupId}`);
        const reviewFiles = await fetchLocationReviews(groupId);
        // console.log("Reviews files from IPFS:", reviewFiles);
        setReviewFilesCount(reviewFiles.length);

        const reviewData = await Promise.all(
          reviewFiles.map(async (file: any) => {
            // console.log(`Load review data from IPFS hash: ${file.ipfs_pin_hash}`);
            const response = await fetch(`https://peach-convincing-gerbil-650.mypinata.cloud/ipfs/${file.ipfs_pin_hash}`);
            
            if (!response.ok) {
              console.error(`Error review file from IPFS: ${file.ipfs_pin_hash}`);
              return null;
            }

            const data = await response.json();
            // console.log("Review data:", data);
            return data;
          })
        );

        const validReviews = reviewData.filter((review) => review !== null);
        setReviews(validReviews);

        // Calculate average rating
        const totalRating = validReviews.reduce((sum, review) => sum + review.rating, 0);
        const avgRating = totalRating / validReviews.length;
        setAverageRating(Number(avgRating.toFixed(1))); // Set rounded average rating

        // console.log("Reviews:", validReviews);
      } catch (error) {
        console.error("Ошибка загрузки отзывов:", error);
      } finally {
        setIsLoadingReviews(false);
        setIsLoadingRating(false);
      }
    };

    loadReviews();
  }, [groupId]);

  const handleLoadMore = () => setVisibleReviewsCount((prev) => prev + 2);

  return (
    <>
      <div className="container my-4">
        <header className="location-header">
            <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src="https://images.unsplash.com/photo-1556761175-4b46a572b786" className="d-block w-100" alt="Image 1" />
                    </div>
                    <div className="carousel-item">
                        <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945" className="d-block w-100" alt="Image 3" />
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
            <h1 className="mt-3">Luxury Beach Resort</h1>
            {isLoadingRating ? (
              <div className="skeleton mx-auto" style={{ width: '300px', height: '24px' }}></div>
            ) : (
              <div className="rating">
                <RatingStars averageRating={averageRating} reviewFilesCount={reviewFilesCount} />
              </div>
            )}
            
            <p className="mt-3">Nestled amidst breathtaking landscapes, this luxurious hotel is an oasis of elegance and tranquility. Its architecture seamlessly blends modern sophistication with timeless charm, offering guests a blend of comfort and style. Each room boasts panoramic views, designed to bring nature indoors with floor-to-ceiling windows and private balconies. Guests can indulge in a range of exquisite dining experiences, from international cuisine to local specialties crafted by world-class chefs. The on-site spa offers revitalizing treatments and serene relaxation areas, while amenities such as an infinity pool, fitness center, and guided outdoor excursions provide everything needed for a perfect escape. Whether you’re here for a romantic getaway or a peaceful retreat, every detail is curated to provide an unforgettable experience.</p>

            <div className="pros-cons mt-4">
                <div className="pros">
                    <h5>Pros</h5>
                    <ul className="list-unstyled">
                        <li><i className="bi bi-check-circle-fill text-success me-1"></i> Stunning ocean views with panoramic sunsets.</li>
                        <li><i className="bi bi-check-circle-fill text-success me-1"></i> Excellent customer service with multilingual staff.</li>
                        <li><i className="bi bi-check-circle-fill text-success me-1"></i> Multiple dining options from local to international.</li>
                        <li><i className="bi bi-check-circle-fill text-success me-1"></i> Variety of activities, including snorkeling and yoga.</li>
                    </ul>
                </div>
                <div className="cons">
                    <h5>Cons</h5>
                    <ul className="list-unstyled">
                        <li><i className="bi bi-x-circle-fill text-danger me-1"></i> High prices during peak season.</li>
                        <li><i className="bi bi-x-circle-fill text-danger me-1"></i> Limited parking availability.</li>
                        <li><i className="bi bi-x-circle-fill text-danger me-1"></i> Some rooms may need renovation.</li>
                        <li><i className="bi bi-x-circle-fill text-danger me-1"></i> Occasional noise from nearby events on weekends.</li>
                    </ul>
                </div>
            </div>
        </header>

        <section className='review-section'>
          <h2 className="mt-5">Leave a review</h2>
          
          {isConnected ? (
            <ReviewForm />
            )
            : (
              <>
                <div className="alert alert-danger" role="alert">
                  If you want to write a review you need connect Starknet wallet first.
                </div>
                <WalletBar />
              </>
            )
          }

          <h2 className="mt-5">{locationName} reviews</h2>
          
          {isLoadingReviews ? (
            <div className="text-center mt-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
            ) : (
              <>
                <p className="review-count">Showing {Math.min(visibleReviewsCount, reviewFilesCount)} of {reviewFilesCount} reviews</p>              
                <div className="review-list mt-4">
                  {reviews.slice(0, visibleReviewsCount).map((review, index) => (
                    <ReviewCard key={index} {...review} fancyboxId={`gallery-${index}`}/>
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
          }
        </section>
      </div>
    </>
  );
};

Fancybox.bind('[data-fancybox]', {});

export default Page1;