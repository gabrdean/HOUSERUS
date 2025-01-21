import { useState } from 'react';
import { useDispatch } from 'react-redux';
import './CreateSpot.css';
import { createSpot } from '../../store/spots';
import { useNavigate } from 'react-router-dom';

function CreateSpot() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [country, setCountry] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState(["", "", "", "", ""]);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Validate form
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
    if (!images[0]) newErrors.images = "Preview image is required";

    if (latitude && (isNaN(latitude) || latitude < -90 || latitude > 90)) {
      newErrors.lat = "Latitude must be between -90 and 90";
    }
    if (longitude && (isNaN(longitude) || longitude < -180 || longitude > 180)) {
      newErrors.lng = "Longitude must be between -180 and 180";
    }

    return newErrors;
  };

  const handleImageChange = (index, value) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    
    // Client-side validation
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
      price: Number(price),
      images: images.filter(url => url.length > 0)
    };

    try {
      const newSpot = await dispatch(createSpot(spotData));
      navigate(`/spots/${newSpot.id}`);
    } catch (error) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
        setErrors({ 
          form: "An error occurred while creating your spot. Please try again." 
        });
      }
    }
  };

  return (
    <div className="create-spot-container">
      <div className="header-container">
        <h1 className="page-title">Create a new Spot</h1>
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

        <div className="section">
          <h2 className="section-title">Liven up your spot with photos</h2>
          <p className="section-description">
            Submit a link to at least one photo to publish your spot.
          </p>
          <div className="image-inputs">
            {images.map((url, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder={index === 0 ? "Preview Image URL (required)" : `Image URL ${index + 1} (optional)`}
                  className={`input-field ${submitted && index === 0 && errors.images && !url ? 'error' : ''}`}
                />
                {submitted && index === 0 && errors.images && !url && (
                  <p className="error-text">{errors.images}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="button-container">
          <button
            type="submit"
            className="create-button"
          >
            Create Spot
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateSpot;