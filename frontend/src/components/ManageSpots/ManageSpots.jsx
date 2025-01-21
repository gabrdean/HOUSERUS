import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserSpots } from '../../store/spots';
import { useNavigate, Link } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import DeleteSpotModal from './DeleteSpotModal.jsx';
import './ManageSpots.css';

const ManageSpots = () => {
    // Redux and routing hooks initialization
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { setModalContent } = useModal();
    
    // Optimized Redux selectors
    // Transform userSpots object into array for easier mapping
    const spots = useSelector(state => Object.values(state.spots.userSpots || {}));
    // Get current user for authentication check
    const user = useSelector(state => state.session.user);

    // Authentication and data fetching effect
    useEffect(() => {
        // Redirect to home if not authenticated
        if (!user) {
            navigate('/');
            return;
        }
        // Fetch user's spots from the backend
        dispatch(getUserSpots());
    }, [dispatch, user, navigate]);

    // Navigation and action handlers consolidated into a single object
    const handleNavigation = {
        update: (spotId) => navigate(`/spots/${spotId}/edit`),
        create: () => navigate('/spots/new'),
        delete: (spotId) => setModalContent(<DeleteSpotModal spotId={spotId} />)
    };

    // Nested SpotCard component for cleaner organization
    // Receives individual spot data and renders a card with spot details
    const SpotCard = ({ spot }) => (
        <div className="spot-card">
            {/* Clickable spot image linking to detail view */}
            <Link to={`/spots/${spot.id}`} className="spot-image-container">
                <img 
                    src={spot.previewImage || '/images/placeholder.jpg'} 
                    alt={spot.name}
                    className="spot-image"
                    onError={e => {
                        e.target.src = '/images/placeholder.jpg';
                        e.target.onerror = null;
                    }}
                />
            </Link>
            <div className="spot-info">
                <div className="spot-footer">
                    {/* Spot location and rating display */}
                    <p className="spot-location">
                        {spot.city}, {spot.state}
                        <span className="spot-rating">
                            ★ {spot.avgRating ? Number(spot.avgRating).toFixed(1) : 'New'}
                        </span>
                    </p>
                    {/* Price display */}
                    <p className="spot-price">
                        ${spot.price}<span className="night"> night</span>
                    </p>
                    {/* Action buttons for spot management */}
                    <div className="button-container">
                        <button 
                            onClick={() => handleNavigation.update(spot.id)}
                            className="update-button"
                        >
                            Update
                        </button>
                        <button 
                            onClick={() => handleNavigation.delete(spot.id)}
                            className="delete-button"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Main component render
    return (
        <div className="manage-spots-container">
            <h1 className="manage-spots-title">Manage Your Spots</h1>
            
            {/* Conditional render of create button when user has no spots */}
            {!spots.length && (
                <button 
                    onClick={handleNavigation.create}
                    className="create-spot-button" 
                    id='lowbutton'
                >
                    Create a New Spot
                </button>
            )}

            {/* Grid display of all user's spots */}
            <div className="spots-grid">
                {spots.map(spot => (
                    <SpotCard key={spot.id} spot={spot} />
                ))}
            </div>
        </div>
    );
};

export default ManageSpots;