import { csrfFetch } from "./csrf";

const LOAD_ALL_SPOTS = "spots/loadAllSpots";
const LOAD_SPOT_DETAILS = "spots/loadSpotDetails";
const CREATE_SPOT = "spots/createSpot";
const CREATE_SPOTIMAGES = "spots/createSpotImages";
const DELETE_SPOT = "spots/deleteSpot";
const UPDATE_SPOT = "spot/updateSpot";

const loadAllSpots = (spots) => {
  return {
    type: LOAD_ALL_SPOTS,
    spots,
  };
};

const loadSpotDetails = (spot) => {
  return {
    type: LOAD_SPOT_DETAILS,
    spot,
  };
};

const createSpot = (spot) => {
  return {
    type: CREATE_SPOT,
    spot,
  };
};

const createSpotImages = (spot) => {
  return {
    type: CREATE_SPOTIMAGES,
    spot,
  };
};

const deleteSpot = (spotId) => {
  return {
    type: DELETE_SPOT,
    spotId,
  };
};

const updateSpot = (spot) => {
  return {
    type: UPDATE_SPOT,
    spot,
  };
};

export const getSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots");

  if (response.ok) {
    const spots = await response.json();
    dispatch(loadAllSpots(spots));
    return spots;
  } else {
    const errors = await response.json();
    return errors;
  }
};

export const getSpotDetails = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);

  if (response.ok) {
    const spot = await response.json();
    dispatch(loadSpotDetails(spot));
    return spot;
  } else {
    const errors = await response.json();
    return errors;
  }
};

export const createSingleSpot = (spot) => async (dispatch) => {
  // const { country, address, city, state, name, description, price } = spot;
  try {
    const response = await csrfFetch("/api/spots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(spot),
    });

    const newSpot = await response.json();
    dispatch(createSpot(newSpot));
    return newSpot;
  } catch (errors) {
    return errors;
  }
};

export const createImage = (image, spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: "POST",
    body: JSON.stringify(image),
  });

  if (response.ok) {
    const newImage = await response.json();
    dispatch(createSpotImages(newImage));
    return newImage;
  } else {
    const errors = await response.json();
    return errors;
  }
};

export const deleteOneSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    dispatch(deleteSpot(spotId));
  } else {
    const errors = response.json();
    return errors;
  }
};

export const updateOneSpot = (spot) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spot.id}`, {
    method: "PUT",
    body: JSON.stringify(spot),
  });

  if (response.ok) {
    const updatedSpot = await response.json();
    dispatch(updateSpot(updatedSpot));
    return updatedSpot;
  } else {
    const errors = await response.json();
    return errors;
  }
};

const initialState = {
  allSpots: {},
  singleSpot: {},
};

const spotsReducer = (state = initialState, action) => {
  const newSpots = { ...state.allSpots.Spots };
  switch (action.type) {
    case LOAD_ALL_SPOTS:
      return {
        ...state,
        allSpots: action.spots,
      };
    case LOAD_SPOT_DETAILS:
      return {
        ...state,
        singleSpot: action.spot,
      };
    case CREATE_SPOT:
      return {
        ...state,
        singleSpot: action.spot,
        allSpots: newSpots,
      };
    case DELETE_SPOT:
      // const newSpots = { ...state.allSpots.Spots };
      delete newSpots[action.spotId];
      return {
        ...state,
        allSpots: newSpots,
      };
    case UPDATE_SPOT:
      newSpots[action.spot.id] = action.spot;
      return {
        ...state,
        allSpots: newSpots,
        singleSpot: action.spot,
      };

    default:
      return state;
  }
};

export default spotsReducer;
