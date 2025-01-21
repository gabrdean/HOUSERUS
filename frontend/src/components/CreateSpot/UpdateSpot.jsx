import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { updateSpot, getSpotDetails } from '../../store/spots';
import './CreateSpot.css';

function UpdateSpot() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { spotId } = useParams();
  
  const [country, setCountry] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Fetch existing spot data
  useEffect(() => {
    const loadSpotData = async () => {
      try {
        const spotData = await dispatch(getSpotDetails(spotId));
        if (spotData) {
          setCountry(spotData.country);
          setStreetAddress(spotData.address);
          setCity(spotData.city);
          setState(spotData.state);
          setLatitude(spotData.lat || "");
          setLongitude(spotData.lng || "");
          setDescription(spotData.description);
          setTitle(spotData.name);
          setPrice(spotData.price);
        }
      } catch (error) {
        console.error('Error loading spot details:', error);
      }
    };
    loadSpotData();
  }, [dispatch, spotId]);

  const validateForm = () => {
    const newErrors = {};

    if (!country) newErrors.country = "Country is required";
    if (!streetAddress) newErrors.address = "Street address is required";
    if (!city) newErrors.city = "City is required";
    if (!state) newErrors.state = "State is required";
    if (!description || description.length < 30) {
      newErrors.description = "Description needs 30 or more characters";
    }
    if (!title) newErrors.name = "Name is required";
    if (!price) {
      newErrors.price = "Price is required";
    } else if (isNaN(price) || Number(price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (latitude && (isNaN(latitude) || latitude < -90 || latitude > 90)) {
      newErrors.lat = "Latitude must be between -90 and 90";
    }
    if (longitude && (isNaN(longitude) || longitude < -180 || longitude > 180)) {
      newErrors.lng = "Longitude must be between -180 and 180";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const spotData = {
      country,
      address: streetAddress,
      city,
      state,
      lat: latitude || null,
      lng: longitude || null,
      description,
      name: title,
      price: Number(price)
    };

    try {
      await dispatch(updateSpot(spotId, spotData));
      navigate(`/spots/${spotId}`);
    } catch (error) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
        setErrors({ 
          form: "An error occurred while updating your spot. Please try again." 
        });
      }
    }
  };

  return (
    <div className="create-spot-container">
      <div className="header-container">
        <h1 className="page-title">Update your Spot</h1>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        {errors.form && (
          <div className="error-message">{errors.form}</div>
        )}

        <div className="section">
          <h2 className="section-title">Where is your place located?</h2>
          <p className="section-description">
            Guests will only get your exact address once they booked a reservation.
          </p>

          <div className="input-group">
            <div>
              <label className="label">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country"
                className={`input-field ${submitted && errors.country ? 'error' : ''}`}
              />
              {submitted && errors.country && (
                <p className="error-text">{errors.country}</p>
              )}
            </div>

            <div>
              <label className="label">Street Address</label>
              <input
                type="text"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                placeholder="Address"
                className={`input-field ${submitted && errors.address ? 'error' : ''}`}
              />
              {submitted && errors.address && (
                <p className="error-text">{errors.address}</p>
              )}
            </div>

            <div className="grid-2-cols">
              <div>
                <label className="label">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className={`input-field ${submitted && errors.city ? 'error' : ''}`}
                />
                {submitted && errors.city && (
                  <p className="error-text">{errors.city}</p>
                )}
              </div>
              <div>
                <label className="label">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State"
                  className={`input-field ${submitted && errors.state ? 'error' : ''}`}
                />
                {submitted && errors.state && (
                  <p className="error-text">{errors.state}</p>
                )}
              </div>
            </div>

            <div className="grid-2-cols">
              <div>
                <label className="label">Latitude</label>
                <input
                  type="text"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="Latitude"
                  className={`input-field ${submitted && errors.lat ? 'error' : ''}`}
                />
                {submitted && errors.lat && (
                  <p className="error-text">{errors.lat}</p>
                )}
              </div>
              <div>
                <label className="label">Longitude</label>
                <input
                  type="text"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="Longitude"
                  className={`input-field ${submitted && errors.lng ? 'error' : ''}`}
                />
                {submitted && errors.lng && (
                  <p className="error-text">{errors.lng}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Describe your place to guests</h2>
          <p className="section-description">
            Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.
          </p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please write at least 30 characters"
            className={`textarea-field ${submitted && errors.description ? 'error' : ''}`}
            rows="5"
          />
          {submitted && errors.description && (
            <p className="error-text">{errors.description}</p>
          )}
        </div>

        <div className="section">
          <h2 className="section-title">Create a title for your spot</h2>
          <p className="section-description">
            Catch the attention of guests with a spot title that highlights what makes your place special.
          </p>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Name of your spot"
            className={`input-field ${submitted && errors.name ? 'error' : ''}`}
          />
          {submitted && errors.name && (
            <p className="error-text">{errors.name}</p>
          )}
        </div>

        <div className="section">
          <h2 className="section-title">Set a base price for your spot</h2>
          <p className="section-description">
            Competitive pricing can help your listing stand out and rank higher in search results.
          </p>
          <div className="price-input-container">
            <span className="price-symbol">$</span>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price per night (USD)"
              className={`input-field ${submitted && errors.price ? 'error' : ''}`}
            />
          </div>
          {submitted && errors.price && (
            <p className="error-text">{errors.price}</p>
          )}
        </div>

        <div className="button-container">
          <button
            type="submit"
            className="create-button"
          >
            Update your Spot
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateSpot;