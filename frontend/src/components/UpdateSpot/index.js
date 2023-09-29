import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { updateOneSpot, getSpotDetails } from "../../store/spots";

function UpdateSpot() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { spotId } = useParams();
  const [validationErrors, setValidationErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const spot = useSelector((state) => state.spots.singleSpot);

  const [country, setCountry] = useState(spot.country);
  const [address, setAddress] = useState(spot.address);
  const [city, setCity] = useState(spot.city);
  const [state, setState] = useState(spot.state);
  const [description, setDescription] = useState(spot.description);
  const [name, setName] = useState(spot.name);
  const [price, setPrice] = useState(spot.price);

  useEffect(() => {
    dispatch(getSpotDetails(spotId));
  }, [dispatch, spotId]);

  useEffect(() => {
    setAddress(spot.address || "");
    setCountry(spot.country || "");
    setCity(spot.city || "");
    setState(spot.state || "");
    setDescription(spot.description || "");
    setName(spot.name || "");
    setPrice(spot.price || "");
  }, [spot]);

  const submitUpdatedSpot = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    const errors = {};

    if (!address) errors.address = "Street address is required";
    if (!city) errors.city = "City is required";
    if (!country) errors.country = "Country is required";
    if (!state) errors.state = "State is required";
    if (!name) errors.name = "Name is required";
    if (name && name.length > 50)
      errors.name = "Name must be less than 50 characters";
    if (description && description.length < 30)
      errors.description = "Description is required";
    if (!price) errors.price = "Price per day is required";

    setValidationErrors(errors);

    const updatedSpot = {
      id: spot.id,
      country,
      address,
      city,
      state,
      description,
      name,
      price,
      lat: 1,
      lng: 1,
    };

    if (Object.keys(validationErrors).length === 0) {
      const response = await dispatch(updateOneSpot(updatedSpot));

      if (response) {
        history.push(`/spot/${response.id}`);
      }
    }
  };

  return (
    <div>
      <h2>Update your Spot</h2>
      <form onSubmit={submitUpdatedSpot}>
        <div className="section-1">
          <h3>Where's your place located?</h3>
          <p>
            Guests will only get your exact address once they booked a
            reservation.
          </p>
          <label>
            Country
            <input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country"
              type="text"
            />
          </label>
          {hasSubmitted && validationErrors.country && (
            <div className="error">{validationErrors.country}</div>
          )}

          <label>
            Street Address
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
              type="text"
            />
          </label>
          {hasSubmitted && validationErrors.address && (
            <div className="error">{validationErrors.address}</div>
          )}

          <label>
            City
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              type="text"
            />
          </label>
          {hasSubmitted && validationErrors.city && (
            <div className="error">{validationErrors.city}</div>
          )}

          <label>
            State
            <input
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="State"
              type="text"
            />
          </label>
          {hasSubmitted && validationErrors.state && (
            <div className="error">{validationErrors.state}</div>
          )}
        </div>
        <div className="section-2">
          <h3>Describe your place to guests</h3>
          <p>
            Mention the best features of your space, any special amentities like
            fast wifi or parking, and what you love about the neighborhood.
          </p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please write atleast 30 characters"
          />
          {hasSubmitted && validationErrors.description && (
            <div className="error">{validationErrors.description}</div>
          )}
        </div>
        <div className="section-3">
          <h3>Create a title for your spot</h3>
          <p>
            Catch guests' attention with a spot title that highlights what makes
            your place special.
          </p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name of your spot"
            type="text"
          />
          {hasSubmitted && validationErrors.name && (
            <div className="error">{validationErrors.name}</div>
          )}
        </div>
        <div className="section-4">
          <h3>Set a base price for your spot</h3>
          <p>
            Competitive pricing can help your listing stand out and rank higher
            in search results.
          </p>
          <label>
            $
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price per night (USD)"
              type="number"
            />
          </label>
          {hasSubmitted && validationErrors.price && (
            <div className="error">{validationErrors.price}</div>
          )}
        </div>

        <button type="submit">Update your Spot</button>
      </form>
    </div>
  );
}

export default UpdateSpot;
