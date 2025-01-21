// src/store/reviews.js
import { csrfFetch } from './csrf';

// Action Types
const CREATE_REVIEW = 'reviews/CREATE_REVIEW';
const LOAD_SPOT_REVIEWS = 'reviews/LOAD_SPOT_REVIEWS';
const DELETE_REVIEW = 'reviews/DELETE_REVIEW'; // Add this

// Action Creators
const createReview = (review) => ({
  type: CREATE_REVIEW,
  review
});

const loadSpotReviews = (reviews) => ({
  type: LOAD_SPOT_REVIEWS,
  reviews
});

const removeReview = (reviewId, spotId) => ({  // Add this
  type: DELETE_REVIEW,
  reviewId,
  spotId
});

// Thunk Action Creators
export const createSpotReview = (spotId, reviewData) => async dispatch => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
    if (response.ok) {
      const review = await response.json();
      dispatch(createReview(review));
      return review;
    }
  } catch (error) {
    const data = await error.json();
    throw data;
  }
};

export const getSpotReviews = (spotId) => async dispatch => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
  if (response.ok) {
    const reviews = await response.json();
    dispatch(loadSpotReviews(reviews.Reviews));
    return reviews;
  }
};

// Add this thunk
export const deleteReview = (reviewId, spotId) => async dispatch => {
  try {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      dispatch(removeReview(reviewId, spotId));
      return true;
    }
  } catch (error) {
    const data = await error.json();
    throw data;
  }
};

// Initial State
const initialState = {
  spot: {}, // Reviews organized by spot ID
  user: {} // Reviews organized by user ID
};

// Reducer
const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_REVIEW: {
      const spotId = action.review.spotId;
      return {
        ...state,
        spot: {
          ...state.spot,
          [spotId]: [...(state.spot[spotId] || []), action.review]
        }
      };
    }
    case LOAD_SPOT_REVIEWS: {
      const spotId = action.reviews[0]?.spotId;
      return {
        ...state,
        spot: {
          ...state.spot,
          [spotId]: action.reviews
        }
      };
    }
    case DELETE_REVIEW: {  // Add this case
      const newState = { ...state };
      const spotReviews = newState.spot[action.spotId];
      if (spotReviews) {
        newState.spot[action.spotId] = spotReviews.filter(
          review => review.id !== action.reviewId
        );
      }
      return newState;
    }
    default:
      return state;
  }
};

export default reviewsReducer;