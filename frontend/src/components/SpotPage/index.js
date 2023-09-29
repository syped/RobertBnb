import { useDispatch, useSelector } from "react-redux";
import { getSpotDetails } from "../../store/spots";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SpotPageReviews from "./SpotPageReviews";
import star from "../../assets/star.svg";
import { getReviews } from "../../store/reviews";

function SpotDetails() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const oneSpot = useSelector((state) => state.spots.singleSpot);

  useEffect(() => {
    dispatch(getSpotDetails(spotId)).then(() => setIsLoaded(true));
  }, [dispatch, spotId]);

  const reserveHandler = () => {
    return alert("Feature coming soon");
  };

  // if (!oneSpot.SpotImages || !oneSpot.Owner) return null;
  if (oneSpot.id !== parseInt(spotId)) return null;
  // console.log(oneSpot);

  // dispatch(getReviews(spotId));
  // setRefresh(false);

  return (
    <>
      {isLoaded && (
        <div className="spot-details">
          <div className="spot-name">{oneSpot.name}</div>
          <div className="spot-location">
            <div>
              {oneSpot.city}, {oneSpot.state}, {oneSpot.country}
            </div>
          </div>
          <div className="spot-images">
            {oneSpot.SpotImages.map((image) => (
              <img key={image.id} src={image.url} alt="spot-pic" />
            ))}
          </div>
          <div className="spot-owner">
            Hosted by {oneSpot.Owner.firstName} {oneSpot.Owner.lastName}
          </div>
          <div>{oneSpot.description}</div>

          <div className="callout-card">
            <div>${oneSpot.price} night</div>
            <div className="starReview-SP">
              <img src={star} className="star" alt="star-review"></img>
              <div className="review">
                {oneSpot.avgRating === 0 ? "New" : oneSpot.avgRating}
              </div>
            </div>

            {oneSpot.avgRating === 0 ? null : (
              <div>
                {oneSpot.numReviews === 1 ? (
                  <div> · {oneSpot.numReviews} Review</div>
                ) : (
                  <div> · {oneSpot.numReviews} Reviews</div>
                )}
              </div>
            )}
            <button onClick={reserveHandler}>Reserve</button>
          </div>

          <div className="review-heading">
            <div className="starReview-SP">
              <img src={star} className="star" alt="star-review"></img>
              <div className="review">
                {oneSpot.avgRating === 0 ? "New" : oneSpot.avgRating}
              </div>
            </div>
            {oneSpot.avgRating === 0 ? null : (
              <div>
                {oneSpot.numReviews === 1 ? (
                  <div> · {oneSpot.numReviews} Review</div>
                ) : (
                  <div> · {oneSpot.numReviews} Reviews</div>
                )}
              </div>
            )}
          </div>

          <SpotPageReviews spotId={spotId} oneSpot={oneSpot} />
        </div>
      )}
    </>
  );
}

export default SpotDetails;
