import { csrfFetch } from "./csrf";

const LOAD_ALL_REVIEWS = "reviews/loadAllReviews";

const loadAllReviews = (reviews) => {
  return {
    type: LOAD_ALL_REVIEWS,
    reviews,
  };
};

export const getReviews = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`);

  if (response.ok) {
    const reviews = await response.json();
    dispatch(loadAllReviews(reviews));
    return reviews;
  } else {
    const errors = await response.json();
    return errors;
  }
};

const initialState = {
  spot: {},
  user: {},
};

const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_ALL_REVIEWS:
      return {
        ...state,
        spot: action.reviews,
      };
    default:
      return state;
  }
};

export default reviewsReducer;
