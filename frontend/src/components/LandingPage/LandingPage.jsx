import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const SpotsLanding = () => {
  const [spots, setSpots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await fetch('/api/spots');
        if (response.ok) {
          const data = await response.json();
          setSpots(data.Spots);
        }
      } catch (error) {
        console.error('Error fetching spots:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpots();
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Loading spots...</p>
      </div>
    );
  }

  return (
    <div className="spots-container">
      <h1 className="spots-title">Find your next getaway</h1>
      
      <div className="spots-grid">
        {spots.map((spot) => (
          
          <Link key={spot.id} to={`/spots/${spot.id}`} className="spot-link">
            <div className="spot-card tooltip">
              
              <div className="spot-image-container">
                <img
                  src={spot.previewImage || '/images/placeholder.jpg'} 
                  alt={spot.name}
                  className="spot-image"
                />
              </div>
              <div className="spot-content">
                <div className="spot-header">
                  <h2 className="spot-name spot-tooltiptext">{spot.name}</h2>
                  <div className="spot-rating">
                    <span>★</span>
                    <span>{spot.avgRating ? spot.avgRating.toFixed(1) : 'New'}</span> 
                  </div>
                </div>
                <p className="spot-location">{spot.city}, {spot.state}</p>
                <p className="spot-price">
                  <span>${spot.price}</span>
                  <span className="price-night"> night</span>
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpotsLanding;