import { useSelector, useDispatch } from "react-redux";
import { getSpots } from "../../store/spots";
import { NavLink } from "react-router-dom";
// import "./LandingPage.css";
import star from "../../assets/star.svg";

function AllSpots() {
  const dispatch = useDispatch();
  // const [isLoaded, setIsLoaded] = useState(false);

  const allSpotsArr = useSelector((state) => state.spots.allSpots.Spots);

  // useEffect(() => {
  //   dispatch(getSpots()).then(() => setIsLoaded(true));
  // }, [dispatch]);

  if (!allSpotsArr || !allSpotsArr.length) {
    dispatch(getSpots());
    return null;
  }

  return (
    <>
      {/* {isLoaded && ( */}
      <div className="spots">
        {allSpotsArr.map((spot) => (
          <NavLink key={spot.id} to={`/spot/${spot.id}`}>
            <div title={spot.name} className="spot">
              <div className="image">
                <img src={spot.previewImage} alt="spotImg" />
              </div>
              <div className="city-state">
                {spot.city}, {spot.state}
              </div>
              <div className="starReview-LP">
                {/* <img src={star} alt="star-review" className="star"></img> */}
                <i className="fa fa-star"></i>
                <div className="review">
                  {spot.avgRating === 0 ? "New" : spot.avgRating}
                </div>
              </div>
              <div className="price-night">
                <div className="price">${spot.price}</div> night
              </div>
            </div>
          </NavLink>
        ))}
      </div>
      {/* )} */}
    </>
  );
}

export default AllSpots;
