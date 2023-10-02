import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createOneReview, getReviews } from "../../store/reviews";
import { useModal } from "../../context/Modal";
import { getSpotDetails } from "../../store/spots";

function PostReview({ user, spot }) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [disabled, setDisabled] = useState(false);
  const [activeRating, setActiveRating] = useState(rating);
  // const [onChange, onChange] = useState(0);

  //   useEffect(() => {
  //     const errors = {};

  //     if (!comment) errors.comment = "Comment is required";
  //     if (rating === 0) errors.rating = "Star Rating is required";

  //     setValidationErrors(errors);
  //   }, [comment, rating]);

  const onChange = (number) => {
    setRating(parseInt(number));
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);
    // setValidationErrors({});

    const newReview = {
      userId: user.id,
      spotId: spot.id,
      review: comment,
      stars: rating,
    };

    // if (Object.keys(validationErrors).length === 0) {
    const response = await dispatch(createOneReview(newReview, spot.id)).catch(
      async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setValidationErrors(data.errors);
        }
      }
    );
    dispatch(getReviews(spot.id));
    await dispatch(getSpotDetails(spot.id));

    // setHasSubmitted(false);
    closeModal();

    setComment("");
    setRating(0);
    setHasSubmitted(false);
    return null;

    //   closeModal();
    // }
  };

  return (
    <div className="review-modal">
      <h2>How was your stay?</h2>
      <form onSubmit={submitReview}>
        {hasSubmitted && validationErrors.reviews && (
          <div className="error">{validationErrors.reviews}</div>
        )}
        {hasSubmitted && validationErrors.stars && (
          <div className="error">{validationErrors.stars}</div>
        )}
        <textarea
          className="post-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Leave your review here..."
        />
        <label>
          {/* <input
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            type="range"
            min="1"
            max="5"
          /> */}
          <div className="rating-input">
            <div
              className={activeRating >= 1 ? "filled" : "empty"}
              onMouseEnter={() => {
                if (!disabled) setActiveRating(1);
              }}
              onMouseLeave={() => {
                if (!disabled) setActiveRating(rating);
              }}
              onClick={() => {
                if (!disabled) onChange(1);
              }}
            >
              <i className="fa fa-star"></i>
            </div>
            <div
              className={activeRating >= 2 ? "filled" : "empty"}
              onMouseEnter={() => {
                if (!disabled) setActiveRating(2);
              }}
              onMouseLeave={() => {
                if (!disabled) setActiveRating(rating);
              }}
              onClick={() => {
                if (!disabled) onChange(2);
              }}
            >
              <i className="fa fa-star"></i>
            </div>
            <div
              className={activeRating >= 3 ? "filled" : "empty"}
              onMouseEnter={() => {
                if (!disabled) setActiveRating(3);
              }}
              onMouseLeave={() => {
                if (!disabled) setActiveRating(rating);
              }}
              onClick={() => {
                if (!disabled) onChange(3);
              }}
            >
              <i className="fa fa-star"></i>
            </div>
            <div
              className={activeRating >= 4 ? "filled" : "empty"}
              onMouseEnter={() => {
                if (!disabled) setActiveRating(4);
              }}
              onMouseLeave={() => {
                if (!disabled) setActiveRating(rating);
              }}
              onClick={() => {
                if (!disabled) onChange(4);
              }}
            >
              <i className="fa fa-star"></i>
            </div>
            <div
              className={activeRating >= 5 ? "filled" : "empty"}
              onMouseEnter={() => {
                if (!disabled) setActiveRating(5);
              }}
              onMouseLeave={() => {
                if (!disabled) setActiveRating(rating);
              }}
              onClick={() => {
                if (!disabled) onChange(5);
              }}
            >
              <i className="fa fa-star"></i>
            </div>
            Stars
          </div>
        </label>
        <button
          className="submit-review"
          type="submit"
          disabled={comment.length < 10 || rating === 0}
        >
          Submit Your Review
        </button>
      </form>
    </div>
  );
}

export default PostReview;
