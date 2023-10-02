import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReviews } from "../../store/reviews";
import OpenModalButton from "../OpenModalButton";
import PostReview from "../PostReview";
import DeleteReview from "../DeleteReview";

function SpotReviews({ spotId, oneSpot }) {
  const dispatch = useDispatch();

  const spotReviews = useSelector((state) => state.reviews.spot.Reviews);
  const sessionUser = useSelector((state) => state.session.user);
  const spot = useSelector((state) => state.spots.singleSpot);

  useEffect(() => {
    dispatch(getReviews(spot.id));
    // console.log("hey", spotReviews);
    // console.log(
    //   "hey",
    //   spotReviews.length === 0 &&
    //     sessionUser !== null &&
    //     sessionUser.id !== oneSpot.Owner.id
    // );
  }, [dispatch, spot]);

  if (!spotReviews) {
    return null;
  }

  if (!sessionUser) {
    return spotReviews.map((review) => (
      <div key={review.id} className="one-review">
        <div className="review-firstName">{review?.User?.firstName}</div>
        <div className="review-date">
          {new Date(review.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
          })}
        </div>
        <div className="review-comment">{review.review}</div>
      </div>
    ));
  }

  const userReview = spotReviews.find(
    (review) => review.userId === sessionUser.id
  );

  // if (spotReviews[0].spotId !== parseInt(spotId)) return null;

  // const dateMaker = () => {
  //   const date = newDate(review.createdAt);
  // };

  // if (!review.User) return null;

  if (!spotReviews.length) {
    return (
      <>
        {sessionUser && !userReview && oneSpot.Owner.id !== sessionUser.id && (
          <div className="post-review-button">
            <OpenModalButton
              buttonText="Post Your Review"
              modalComponent={<PostReview user={sessionUser} spot={oneSpot} />}
            />
          </div>
        )}
        <div className="review-section">
          {spotReviews.length === 0 &&
            sessionUser !== null &&
            sessionUser.id !== oneSpot.Owner.id && (
              <div>Be the first to post a review!</div>
            )}
        </div>
      </>
    );
  }

  return (
    <>
      {/* {sessionUser && !userReview && oneSpot.Owner.id !== sessionUser.id ? (
        <div className="post-review-button">
          <OpenModalButton
            buttonText="Post Your Review"
            modalComponent={<PostReview user={sessionUser} spot={oneSpot} />}
          />
        </div>
      ) : null} */}
      {/* <div className="review-section">
        {spotReviews.length === 0 &&
        sessionUser !== null &&
        sessionUser.id !== oneSpot.Owner.id ? (
          <div>Be the first to post a review!</div>
        ) : (
          ( */}
      {spotReviews
        .map((review) => (
          <div key={review.id} className="one-review">
            <div className="review-firstName">{review?.User?.firstName}</div>
            <div className="review-date">
              {new Date(review.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
            </div>
            <div className="review-comment">{review.review}</div>
            {sessionUser.id === review?.User?.id ? (
              <div className="delete-review-button">
                <OpenModalButton
                  buttonText="Delete"
                  modalComponent={
                    <DeleteReview review={review} spot={oneSpot} />
                  }
                />
              </div>
            ) : null}
          </div>
        ))
        .reverse()}
    </>
  );
}

export default SpotReviews;
