import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReviews } from "../../store/reviews";

function SpotReviews({ spotId, oneSpot }) {
  const dispatch = useDispatch();

  const spotReviews = useSelector((state) => state.reviews.spot.Reviews);
  const sessionUser = useSelector((state) => state.session.user);
  // const spot = useSelector(state => state.spots.singleSpot)

  useEffect(() => {
    dispatch(getReviews(spotId));
    // console.log(
    //   "hey",
    //   spotReviews.length === 0 &&
    //     sessionUser !== null &&
    //     sessionUser.id !== oneSpot.Owner.id
    // );
  }, [dispatch, spotId]);

  if (!spotReviews) {
    return null;
  }

  // if (spotReviews[0].spotId !== parseInt(spotId)) return null;

  // const dateMaker = () => {
  //   const date = newDate(review.createdAt);
  // };

  return (
    <>
      <div className="review-section">
        {spotReviews.length === 0 &&
        sessionUser !== null &&
        sessionUser.id !== oneSpot.Owner.id ? (
          <div>Be the first to post a review!</div>
        ) : (
          spotReviews
            .map((review) => (
              <div key={review.id} className="review">
                <div>{review.User.firstName}</div>
                <div>
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </div>
                <div>{review.review}</div>
              </div>
            ))
            .reverse()
        )}
      </div>
    </>
  );
}

export default SpotReviews;
