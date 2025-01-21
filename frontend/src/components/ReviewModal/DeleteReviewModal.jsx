import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteReview } from '../../store/reviews';
import './ReviewModal.css'

function DeleteReviewModal({ reviewId, spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    try {
      await dispatch(deleteReview(reviewId, spotId));
      closeModal();
    } catch (error) {
      console.error('Failed to delete review', error);
    }
  };

  const handleKeepReview = () => {
    closeModal();
  };

  return (
    <div className="delete-review-modal">
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this review?</p>

        <button 
            onClick={handleDelete} 
            className="delete-review-confirm"
        >
            Yes (Delete Review)
        </button>
        <button 
            onClick={handleKeepReview} 
            className="delete-review-cancel"
        >
            No (Keep Review)
        </button>
  
    </div>
  );
}

export default DeleteReviewModal;