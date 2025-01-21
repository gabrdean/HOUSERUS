import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './ReviewModal.css';
import { createSpotReview } from '../../store/reviews';

function ReviewModal({ spotId }) {
  const dispatch = useDispatch();
  const [review, setReview] = useState("");
  const [hover, setHover] = useState(0);
  const [stars, setStars] = useState(0);
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  // Validation check
  const isFormValid = () => {
    const reviewLength = review.length >= 10; // Minimum review length
    const validStars = stars >= 1 && stars <= 5; // Star rating must be 1-5
    
    return reviewLength && validStars;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const reviewData = {
      review,
      stars
    };

    try {
      // Assuming you'll create this action creator in your store
      await dispatch(createSpotReview(spotId, reviewData));
      closeModal();
    } catch (error) {
      if (error.errors) {
        setErrors(error.errors);
      }
    }
  };

  return (
    <>
      <h1>How was your stay?</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <textarea
            value={review}
            placeholder="Leave your review here..."
            onChange={(e) => setReview(e.target.value)}
            required
            rows="4"
          />
        </label>
        {errors.review && <p>{errors.review}</p>}

        <div className="stars-input">
        {[1, 2, 3, 4, 5].map((num) => (
            <span
              key={num}
              className={`star ${num <= (hover || stars) ? 'filled' : ''}`}
              onClick={() => setStars(num)}
              onMouseEnter={() => setHover(num)}
              onMouseLeave={() => setHover(0)}
            >
              ★
            </span>
          ))} 
          <div className ='Stars'>Stars</div>
        </div>
       
        {errors.stars && <p>{errors.stars}</p>}

        <button
          type="submit"
          disabled={!isFormValid()}
          className="submit-review-button"
        >
          Submit Your Review
        </button>
      </form>
    </>
  );
}

export default ReviewModal;