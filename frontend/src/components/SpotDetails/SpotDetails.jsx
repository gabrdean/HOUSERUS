import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getSpotDetails } from '../../store/spots';
import { getSpotReviews } from '../../store/reviews';
import DeleteReviewModal from '../ReviewModal/DeleteReviewModal';
import OpenModalButton from '../../components/OpenModalButton/OpenModalButton';
import ReviewModal from '../ReviewModal/ReviewModal';
import './SpotDetails.css';

const SpotDetails = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  
  // Optimized selectors
  const spot = useSelector(state => state.spots.singleSpot);
  const reviews = useSelector(state => state.reviews.spot[spotId] || []);
  const currentUser = useSelector(state => state.session.user);
  const isOwner = currentUser?.id === spot?.ownerId;
  const hasReviewed = reviews.some(review => review.User?.id === currentUser?.id);
  const canPostReview = currentUser && !isOwner && !hasReviewed;

  useEffect(() => {
    dispatch(getSpotDetails(spotId))
      .then(() => dispatch(getSpotReviews(spotId)))
      .catch(error => console.error('Error loading spot data:', error));
  }, [spotId, dispatch]);

  if (!spot) return <div>Loading...</div>;

  const previewImage = spot.SpotImages?.find(img => img.preview)?.url || '/images/placeholder.jpg';
  const additionalImages = [
    ...(spot.SpotImages?.filter(img => !img.preview).slice(0, 4) || []),
    ...Array(4).fill(null)
  ].slice(0, 4);

  const avgRating = reviews.length ? 
    (reviews.reduce((sum, review) => sum + review.stars, 0) / reviews.length).toFixed(1) : 
    'New';

  const reviewText = reviews.length ? 
    `· ${reviews.length} ${reviews.length === 1 ? "Review" : "Reviews"}` : 
    "";

  return (
    <div className="spot-details-container">
      <h1 className='spot-name'>{spot.name}</h1>
      <p>{spot.city}, {spot.state}, {spot.country}</p>
      
      <div className="images-grid">
        <div className="preview-image">
          <img src={previewImage} alt="Main spot" />
        </div>
        
        <div className="additional-images">
          {additionalImages.map((image, index) => (
            <div key={index} className="small-image">
              <img 
                className='placeholder'
                src={image?.url || '/images/placeholder.jpg'} 
                alt={`Spot ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="spot-main-content">
        <div className="spot-info">
          <h2 className='host-info'>Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}</h2>
          <p>{spot.description}</p>
        </div>

        <div className="booking-card">
          <div className="booking-card-content">
            <div className="price-reviews">
              <span className="price">
                ${spot.price}<span className="night">/night</span>
              </span>
              <div className="card-rating">
                ★ {avgRating} {reviewText}
              </div>
            </div>
            <button 
              className="reserve-button" 
              onClick={() => alert("Feature Coming Soon...")}
            >
              Reserve
            </button>
          </div>
        </div>
      </div>

      <div className="reviews-section">
        <div className="reviews-header">
          <h2>★ {avgRating} {reviewText}</h2>
        </div>
        
        {canPostReview && (
          <>
            <OpenModalButton
              buttonText="Leave a Review :)"
              modalComponent={<ReviewModal spotId={spotId} />}
              buttonClassName="review-button"
            />
            {!reviews.length && <h3>Be the first to post a review!</h3>}
          </>
        )}
        
        <div className="reviews-grid">
          {reviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <h3>{review.User?.firstName}</h3>
                <p className="review-date">
                  {new Date(review.createdAt).toLocaleDateString('en-US', { 
                    month: 'long',
                    year: 'numeric' 
                  })}
                </p>
              </div>
              <p className="review-text">{review.review}</p>
              <div className="review-stars">★ {review.stars}</div>
              {currentUser?.id === review.userId && (
                <OpenModalButton 
                  buttonText="Delete"
                  modalComponent={
                    <DeleteReviewModal 
                      reviewId={review.id} 
                      spotId={spotId} 
                    />
                  }
                  buttonClassName="delete-review-button"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpotDetails;