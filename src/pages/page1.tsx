import React from 'react';
import { useAccount } from "@starknet-react/core";
import ReviewInputForm from '../components/ReviewInputForm.tsx';
import ReviewForm from '../components/ReviewForm.tsx';
import WalletBar from '../components/WalletBar.tsx';

const Page1: React.FC = () => {

  const { isConnected, address } = useAccount();

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
            <p className="mt-3">This beautiful beach resort offers luxury accommodations and top-notch amenities, perfect for a relaxing getaway. Located in a picturesque setting, it is ideal for both solo travelers and families.</p>

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

        <h2 className="mt-5">Leave a Review</h2>

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

        <h2 className="mt-5">Reviews</h2>
        <p className="review-count">Showing 2 of 5 reviews</p>
        <div className="review-list mt-4">
            <div className="card mb-3">
                <div className="card-body">
                    <h5 className="card-title">0x1234...5678</h5>
                    <div className="rating">
                        <i className="bi bi-star-fill"></i>
                        <i className="bi bi-star-fill"></i>
                        <i className="bi bi-star-fill"></i>
                        <i className="bi bi-star"></i>
                        <i className="bi bi-star"></i>
                    </div>
                    <p className="reviews-date">Reviewed on 2024-10-23</p>
                    <p className="card-text mt-2">Great place to stay! The view was amazing, and the staff was incredibly friendly. I especially loved the private beach access and the variety of activities they offer. However, the food at the on-site restaurant could have been better. Overall, I had a wonderful experience!</p>
                </div>
            </div>
            <div className="card mb-3">
                <div className="card-body">
                    <h5 className="card-title">0xabcd...ef12</h5>
                    <div className="rating">
                        <i className="bi bi-star-fill"></i>
                        <i className="bi bi-star-fill"></i>
                        <i className="bi bi-star-half"></i>
                        <i className="bi bi-star"></i>
                        <i className="bi bi-star"></i>
                    </div>
                    <p className="reviews-date">Reviewed on 2024-10-20</p>
                    <p className="card-text mt-2">Beautiful resort with stunning views, but the prices were a bit high for the overall quality. The staff was friendly, but there were some delays in service. I'd recommend it for the views and amenities, but be prepared for some hiccups during peak season.</p>
                </div>
            </div>
        </div>
      </div>
   </>
  );
};

export default Page1;