import { useSelector, useDispatch } from "react-redux";
import { getSpots } from "../../store/spots";
import { NavLink } from "react-router-dom";
import star from "../../assets/star.svg";

function ManageSpots() {
  const allSpots = useSelector((state) => state.spots.allSpots.Spots);
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();

  if (!allSpots || !allSpots.length) {
    dispatch(getSpots());
    return null;
  }

  const userSpotsArr = allSpots.filter((spot) => spot.ownerId === user.id);

  return (
    <>
      <div>Manage Spots</div>
      {!userSpotsArr.length ? (
        <NavLink to="/spots/new">Create a New Spot</NavLink>
      ) : (
        <div className="spots">
          {userSpotsArr.map((spot) => (
            <NavLink key={spot.id} to={`/spot/${spot.id}`}>
              <div title={spot.name} className="spot">
                <div className="image">
                  <img src={spot.previewImage} alt="spotImg" />
                </div>
                <div className="city-state">
                  {spot.city}, {spot.state}
                </div>
                <div className="starReview-LP">
                  <img src={star} className="star"></img>
                  <div className="review">
                    {spot.avgRating === 0 ? "New" : spot.avgRating}
                  </div>
                </div>
                <div className="price">${spot.price} night</div>
              </div>
              <div className="update-delete">
                <button>Update</button>
                <button>Delete</button>
              </div>
            </NavLink>
          ))}
        </div>
      )}
    </>
  );
}

export default ManageSpots;