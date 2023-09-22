import { csrfFetch } from "./csrf";

const LOAD_ALL_SPOTS = "spots/loadAllSpots";
const LOAD_SPOT_DETAILS = "spots/loadSpotDetails";

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

const initialState = {
  allSpots: {},
  singleSpot: {},
};

const spotsReducer = (state = initialState, action) => {
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
    default:
      return state;
  }
};

export default spotsReducer;
