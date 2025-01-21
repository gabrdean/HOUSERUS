import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteSpot } from '../../store/spots'; // You'll need to create this action
import './DeleteSpotModal.css'


function DeleteSpotModal({ spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    try {
      await dispatch(deleteSpot(spotId));
      closeModal();
    } catch (error) {
      console.error('Failed to delete spot', error);
    }
  };

  const handleKeepSpot = () => {
    closeModal();
  };

  return (
    <div className="delete-review-modal">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to remove this spot?</p>

      <button 
        onClick={handleDelete} 
        className="delete-review-confirm"
      >
        Yes (Delete Spot)
      </button>
      <button 
        onClick={handleKeepSpot} 
        className="delete-review-cancel"
      >
        No (Keep Spot)
      </button>
    </div>
  );
}

export default DeleteSpotModal;