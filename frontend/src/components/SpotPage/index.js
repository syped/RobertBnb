import { useDispatch, useSelector } from "react-redux";
import { getSpotDetails } from "../../store/spots";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

function SpotDetails() {
  const dispatch = useDispatch();
  const { spotId } = useParams();

  const oneSpot = useSelector((state) => state.spots.singleSpot);

  useEffect(() => {
    dispatch(getSpotDetails(spotId));
  }, [dispatch, spotId]);

  const reserveHandler = () => {
    return alert("Feature coming soon");
  };

  if (!oneSpot.SpotImages || !oneSpot.Owner) return null;
  return (
    <>
      <div className="spot-details">
        <div className="spot-name">{oneSpot.name}</div>
        <div className="spot-location">
          <div>
            {oneSpot.city}, {oneSpot.state}, {oneSpot.country}
          </div>
        </div>
        <div className="spot-images">
          {oneSpot.SpotImages.map((image) => (
            <img key={oneSpot.id} src={image.url} alt="spot-pic" />
          ))}
        </div>
        <div className="spot-owner">
          Hosted by {oneSpot.Owner.firstName} {oneSpot.Owner.lastName}
        </div>
        <div>{oneSpot.description}</div>
        <div className="callout-card">
          <div>${oneSpot.price} night</div>
          <div>{oneSpot.avgRating}</div>
          <div>{oneSpot.numReviews}</div>
          <button onClick={reserveHandler}>Reserve</button>
        </div>
      </div>
    </>
  );
}

export default SpotDetails;
