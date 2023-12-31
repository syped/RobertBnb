import { useSelector, useDispatch } from "react-redux";
import { getSpots } from "../../store/spots";
import { NavLink, Redirect } from "react-router-dom";
import star from "../../assets/star.svg";
import DeleteSpotModal from "../DeleteSpotModal";
import OpenModalButton from "../OpenModalButton";

function ManageSpots() {
  const allSpots = useSelector((state) => state.spots.allSpots.Spots);
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();

  if (!allSpots || !allSpots.length) {
    dispatch(getSpots());
    return null;
  }

  if (!user) return <Redirect to="/"></Redirect>;

  const userSpotsArr = allSpots.filter((spot) => spot.ownerId === user.id);

  return (
    <>
      <div className="manage-page">
        <div className="manage-spot-title">Manage Spots</div>
        {!userSpotsArr.length ? (
          <NavLink className="create-link" to="/spots/new">
            Create a New Spot
          </NavLink>
        ) : (
          <div className="spots">
            {userSpotsArr.map((spot) => (
              <div key={spot.id}>
                <NavLink to={`/spot/${spot.id}`}>
                  <div title={spot.name} className="spot">
                    <div className="image">
                      <img src={spot.previewImage} alt="spotImg" />
                    </div>
                    <div className="city-state">
                      {spot.city}, {spot.state}
                    </div>
                    <div className="starReview-LP">
                      <img src={star} alt="" className="star"></img>
                      <div className="review">
                        {spot.avgRating === 0 ? "New" : spot.avgRating}
                      </div>
                    </div>
                    <div className="price">${spot.price} night</div>
                  </div>
                </NavLink>
                <div className="update-delete">
                  <NavLink to={`/spots/${spot.id}/edit`}>
                    <button className="spot-update-button">Update</button>
                  </NavLink>

                  <div className="spot-delete-button">
                    <OpenModalButton
                      buttonText="Delete"
                      modalComponent={<DeleteSpotModal spot={spot} />}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default ManageSpots;
