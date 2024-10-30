import React, { useEffect, useState, useRef } from 'react';
import { useAccount } from "@starknet-react/core";
import ReviewInputForm from '../components/ReviewInputForm.tsx';
import ReviewForm from '../components/ReviewForm.tsx';
import WalletBar from '../components/WalletBar.tsx';
import { fetchLocationReviews, fetchGroupIdByLocation } from '../services/pinataService.ts';
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

const Page1: React.FC = () => {

  const { isConnected, address } = useAccount();
  const [reviews, setReviews] = useState<any[]>([]);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [reviewFilesCount, setReviewFilesCount] = useState<number>(0);
  const [visibleReviewsCount, setVisibleReviewsCount] = useState<number>(2);
  const [isLoadingReviews, setIsLoadingReviews] = useState<boolean>(true); 

  
   const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("ru-RU", {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };
  const formatAddress = (address: string) => `${address.substring(0, 5)}...${address.substring(address.length - 5)}`;

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
        // console.log("Reviews:", validReviews);
      } catch (error) {
        console.error("Ошибка загрузки отзывов:", error);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    loadReviews();
  }, [groupId]);

  const handleLoadMore = () => {
    setVisibleReviewsCount((prevCount) => prevCount + 2);
  };

  return (
    <>
      <div className="container my-4">
          <div className="location-header">
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
              <div className="rating">
                  <i className="bi bi-star-fill me-1"></i>
                  <i className="bi bi-star-fill me-1"></i>
                  <i className="bi bi-star-fill me-1"></i>
                  <i className="bi bi-star-fill me-1"></i>
                  <i className="bi bi-star-half me-1"></i>
                  <span className='ms-1'>(253)</span>
              </div>
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
          </div>

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
          )}

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
                  {reviews.length > 0 ? (
                    reviews.slice(0, visibleReviewsCount).map((review, index) => (
                      <div key={index} className="card mb-3">
                        <div className="card-body">
                          <h5 className="card-title">{review.author ? formatAddress(review.author) : "Anonymous"}</h5>
                          <div className="rating mb-2">
                            {[...Array(5)].map((_, i) => (
                              <i key={i} className={`bi ${i < review.rating ? "bi-star-fill me-1" : "bi-star me-1"}`}></i>
                            ))}
                          </div>
                          <p className="reviews-date">Reviewed on {formatDate(review.timestamp)}</p>
                          <p className="card-text mt-2">{review.reviewText}</p>
                          
                          {review.photos && review.photos.length > 0 && (
                            <div className="photos mt-3">
                              {review.photos.map((cid: string, i: number) => (
                                <a 
                                  key={i} 
                                  href={`https://gateway.pinata.cloud/ipfs/${cid}`} 
                                  data-fancybox={`gallery-${index}`} 
                                  data-caption={`Photo ${i + 1}`}
                                >
                                  <img
                                    src={`https://gateway.pinata.cloud/ipfs/${cid}`}
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
                    ))
                ) : (
                  <p>No reviews yet for this location.</p>
                )}

                  {visibleReviewsCount < reviewFilesCount && (
                    <div className="text-center mt-4">
                      <button className="btn btn-custom ps-3 pe-3" onClick={handleLoadMore}>
                        <i className="bi bi-plus-circle-fill me-2"></i> Load more
                      </button>
                    </div>
                  )}
                </div>
              </>
          )}
      </div>
    </>
  );
};

Fancybox.bind('[data-fancybox]', {});

export default Page1;