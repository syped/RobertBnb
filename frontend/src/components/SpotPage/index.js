import { useDispatch, useSelector } from "react-redux";
import { getSpotDetails } from "../../store/spots";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SpotPageReviews from "./SpotPageReviews";
import jett from "../../assets/jett.png";
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
  // dispatch(getSpotDetails(spotId));
  // setRefresh(false);
  let imageCount = 1;

  return (
    <>
      {isLoaded && (
        <div className="spot-details">
          <div className="test">VALORANT</div>
          {/* <img className="jett" src={jett} /> */}
          <div className="spot-name">{oneSpot.name}</div>
          <div className="spot-location">
            <div>
              {oneSpot.city}, {oneSpot.state}, {oneSpot.country}
            </div>
          </div>
          <div className="spot-images">
            {oneSpot.SpotImages.map((image) => (
              <div key={image.id} className={`image${imageCount++}`}>
                <img src={image.url} alt="spot-pic" />
              </div>
            ))}
          </div>
          <div className="spot-owner">
            Hosted by {oneSpot.Owner.firstName} {oneSpot.Owner.lastName}
          </div>
          <div className="detail-container">
            <div className="spot-description">{oneSpot.description}</div>

            <div className="callout-card">
              <div className="price-container">
                <div className="spot-price">${oneSpot.price}</div> night
              </div>
              <div className="starReview-SP">
                {/* <img src={star} className="star" alt="star-review"></img> */}
                <i className="fa fa-star"></i>
                <div className="review">
                  {oneSpot.avgRating === 0 ? "New" : oneSpot.avgRating}
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
              <button className="reserve-button" onClick={reserveHandler}>
                Reserve
              </button>
            </div>
          </div>

          <div className="review-heading">
            <div className="starReview-SP review-header">
              {/* <img src={star} className="star" alt="star-review"></img> */}
              <i className="fa fa-star"></i>
              <div className="review">
                {oneSpot.avgRating === 0 ? "New" : oneSpot.avgRating}
              </div>
              {oneSpot.avgRating === 0 ? null : (
                <div className="num-reviews">
                  {oneSpot.numReviews === 1 ? (
                    <div> · {oneSpot.numReviews} Review</div>
                  ) : (
                    <div> · {oneSpot.numReviews} Reviews</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <SpotPageReviews spotId={spotId} oneSpot={oneSpot} />
        </div>
      )}
    </>
  );
}

export default SpotDetails;
