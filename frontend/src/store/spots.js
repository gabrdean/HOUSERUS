// src/store/spots.js
import { csrfFetch } from './csrf';

// Action Types
const LOAD_SPOT = 'spots/LOAD_SPOT';
const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const ADD_SPOT = 'spots/ADD_SPOT';
const LOAD_USER_SPOTS = 'spots/LOAD_USER_SPOTS';
const DELETE_SPOT = 'spots/DELETE_SPOT';
const UPDATE_SPOT = 'spots/UPDATE_SPOT';

const initialState = {
    allSpots: {},
    singleSpot: null
};

// Action Creators
const loadSpot = (spot) => ({
    type: LOAD_SPOT,
    spot
});

const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots
});

const addSpot = (spot) => ({
    type: ADD_SPOT,
    spot
});

const loadUserSpots = (spots) => ({
    type: LOAD_USER_SPOTS,
    spots
});

const removeSpot = (spotId) => ({
    type: DELETE_SPOT,
    payload: spotId
});

const updateExistingSpot = (spot) => ({
    type: UPDATE_SPOT,
    spot
});

// src/store/spots.js
// ... keep your action types and action creators the same ...

// Fixed thunk action creators
export const createSpot = (spotData) => async dispatch => {
    const response = await csrfFetch('/api/spots', {
        method: 'POST',
        body: JSON.stringify(spotData)
    }).catch(async err => {
        const error = err instanceof Response ? await err.json() : err;
        throw error;
    });

    if (!response.ok) return;
    
    const newSpot = await response.json();

    // After creating spot, handle image uploads
    if (spotData.images?.length > 0) {
        // First image is preview
        await csrfFetch(`/api/spots/${newSpot.id}/images`, {
            method: 'POST',
            body: JSON.stringify({
                url: spotData.images[0],
                preview: true
            })
        });

        // Upload remaining images if any
        for (let i = 1; i < spotData.images.length; i++) {
            if (spotData.images[i]) {
                await csrfFetch(`/api/spots/${newSpot.id}/images`, {
                    method: 'POST',
                    body: JSON.stringify({
                        url: spotData.images[i],
                        preview: false
                    })
                });
            }
        }
    }

    dispatch(addSpot(newSpot));
    return newSpot;
};

export const getSpotDetails = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    
    if (!response.ok) return;
    
    const spot = await response.json();
    dispatch(loadSpot(spot));
    return spot;
};

export const getAllSpots = () => async dispatch => {
    const response = await csrfFetch('/api/spots');
    
    if (!response.ok) return;
    
    const spots = await response.json();
    dispatch(loadSpots(spots));
    return spots;
};

export const getUserSpots = () => async (dispatch, getState) => {
    const { user } = getState().session;
    if (!user) return;

    const response = await csrfFetch('/api/spots/current');
    
    if (!response.ok) return;
    
    const spots = await response.json();
    dispatch(loadUserSpots(spots.Spots));
    return spots.Spots;
};

export const deleteSpot = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE'
    }).catch(error => {
        console.error('Error deleting spot:', error);
        throw error;
    });

    if (!response.ok) return;
    
    dispatch(removeSpot(spotId));
    return spotId;
};

export const updateSpot = (spotId, spotData) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        body: JSON.stringify(spotData)
    }).catch(async err => {
        const error = err instanceof Response ? await err.json() : err;
        throw error;
    });

    if (!response.ok) return;
    
    const updatedSpot = await response.json();
    dispatch(updateExistingSpot(updatedSpot));
    return updatedSpot;
};

// Fixed reducer
const spotsReducer = (state = initialState, action) => {
    let newState;
    
    switch (action.type) {
        case LOAD_SPOT:
            return {
                ...state,
                singleSpot: action.spot
            };
            
        case LOAD_SPOTS: {
            const spotsObj = {};
            action.spots.Spots.forEach(spot => {
                spotsObj[spot.id] = spot;
            });
            return {
                ...state,
                allSpots: spotsObj
            };
        }
            
        case ADD_SPOT:
            return {
                ...state,
                allSpots: {
                    ...state.allSpots,
                    [action.spot.id]: action.spot
                },
                singleSpot: action.spot
            };

        case LOAD_USER_SPOTS: {
            const userSpotsObj = {};
            action.spots.forEach(spot => {
                userSpotsObj[spot.id] = spot;
            });
            return {
                ...state,
                userSpots: userSpotsObj
            };
        }
            
        case DELETE_SPOT:
            newState = { ...state };
            if (newState.userSpots) {
                delete newState.userSpots[action.payload];
            }
            return newState;
            
        case UPDATE_SPOT:
            return {
                ...state,
                allSpots: {
                    ...state.allSpots,
                    [action.spot.id]: action.spot
                },
                userSpots: state.userSpots ? {
                    ...state.userSpots,
                    [action.spot.id]: action.spot
                } : state.userSpots,
                singleSpot: action.spot
            };
            
        default:
            return state;
    }
};

export default spotsReducer;