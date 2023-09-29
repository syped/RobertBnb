import { useState } from "react";
// import { deleteOneSpot } from "../../store/spots";
import { getReviews, removeOneReview } from "../../store/reviews";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { getSpotDetails } from "../../store/spots";

function DeleteReviewButton({ review, spot }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [exists, setExists] = useState(true);

  const confirmDelete = (e) => {
    e.preventDefault();
    // dispatch(deleteOneSpot(spot.id)).then(closeModal);
    dispatch(removeOneReview(review.id)).then(closeModal);
    setExists(false);
  };

  const cancelDelete = (e) => {
    e.preventDefault();
    closeModal();
  };

  dispatch(getSpotDetails(spot.id));
  dispatch(getReviews(spot.id));

  // useEffect(() => {
  //   return spots;
  // }, [spots]);

  return (
    <>
      {exists && (
        <>
          <h2>Confirm Delete</h2>
          <div>Are you sure you want to delete this review?</div>
          <button onClick={confirmDelete}>Yes (Delete Review)</button>
          <button onClick={cancelDelete}>No (Keep Review)</button>
        </>
      )}
    </>
  );
}

export default DeleteReviewButton;
