import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSingleSpot, createImage } from "../../store/spots";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

function CreateSpot() {
  const dispatch = useDispatch();
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [previewImage, setPreviewImage] = useState("");
  const [imageUrls, setImageUrls] = useState(["", "", "", ""]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const history = useHistory();
  const allSpots = useSelector((state) => state.spots.allSpots.Spots);

  const updateImageUrl = (value, index) => {
    const updatedUrls = [...imageUrls];
    updatedUrls[index] = value;
    setImageUrls(updatedUrls);
  };

  useEffect(() => {
    const errors = {};

    if (!address) errors.address = "Street address is required";
    if (!city) errors.city = "City is required";
    if (!country) errors.country = "Country is required";
    if (!state) errors.state = "State is required";
    if (!name) errors.name = "Name is required";
    if (name.length > 50) errors.name = "Name must be less than 50 characters";
    if (description.length < 30) errors.description = "Description is required";
    if (!price) errors.price = "Price per day is required";

    if (!previewImage) errors.previewImage = "Preview image is required.";
    if (
      previewImage &&
      !previewImage.endsWith(".png") &&
      !previewImage.endsWith(".jpg") &&
      !previewImage.endsWith(".jpeg")
    )
      errors.previewImage = "Image URL must end in .png, .jpg, or .jpeg";

    imageUrls.forEach((image) => {
      if (
        image &&
        !image.endsWith(".png") &&
        !image.endsWith(".jpg") &&
        !image.endsWith(".jpeg")
      )
        errors.image = "Image URL must end in .png, .jpg, or .jpeg";
    });

    setValidationErrors(errors);
  }, [
    address,
    city,
    country,
    state,
    name,
    description,
    price,
    previewImage,
    imageUrls,
    allSpots,
  ]);

  const submitSpot = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    const newSpot = {
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

    const newPreviewImage = {
      url: previewImage,
      preview: true,
    };

    if (Object.keys(validationErrors).length === 0) {
      const response = await dispatch(createSingleSpot(newSpot));

      if (response) {
        dispatch(createImage(newPreviewImage, response.id));

        for (let i = 0; i < imageUrls.length; i++) {
          const image = imageUrls[i];

          const newImage = {
            url: image,
            preview: false,
          };

          if (image) {
            dispatch(createImage(newImage, response.id));
          }
        }

        history.push(`/spot/${response.id}`);
        setAddress("");
        setCountry("");
        setCity("");
        setState("");
        setDescription("");
        setName("");
        setPrice("");
        setPreviewImage("");
        setImageUrls(["", "", "", ""]);
        setHasSubmitted(false);
      }
    }
  };

  return (
    <div className="create-form">
      <h2 className="create-title">Create a new Spot</h2>
      <form onSubmit={submitSpot}>
        <div className="section-1">
          <h3>Where's your place located?</h3>
          <p>
            Guests will only get your exact address once they booked a
            reservation.
          </p>
          <label className="input-name">
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

          <label className="input-name">
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

          <div className="input-city-state">
            <label className="input-name input-city">
              City
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                type="text"
              />
            </label>

            <label className="input-name input-state">
              State
              <input
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="State"
                type="text"
              />
            </label>
          </div>
          <div className="city-state-errors">
            {hasSubmitted && validationErrors.city && (
              <div className="error">{validationErrors.city}</div>
            )}
            {hasSubmitted && validationErrors.state && (
              <div className="error">{validationErrors.state}</div>
            )}
          </div>
        </div>
        <div className="section-2">
          <h3>Describe your place to guests</h3>
          <p>
            Mention the best features of your space, any special amentities like
            fast wifi or parking, and what you love about the neighborhood.
          </p>
          <div className="input-desc-container">
            <textarea
              className="input-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please write atleast 30 characters"
            />
          </div>
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
            className="input-name-field"
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
              className="input-price"
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
        <div className="section-5">
          <h3>Liven up your spot with photos</h3>
          <p>Submit a link to at least one photo to publish your spot.</p>
          <input
            className="input-previewImage"
            value={previewImage}
            onChange={(e) => setPreviewImage(e.target.value)}
            placeholder="Preview Image URL"
            type="text"
          />
          {hasSubmitted && validationErrors.previewImage && (
            <div className="error">{validationErrors.previewImage}</div>
          )}
          {imageUrls.map((url, index) => (
            <input
              className="input-images"
              key={index}
              value={url}
              onChange={(e) => updateImageUrl(e.target.value, index)}
              placeholder="Image URL"
              type="text"
            />
          ))}
          {hasSubmitted && validationErrors.image && (
            <div className="error">{validationErrors.image}</div>
          )}
        </div>
        <button className="create-spot-button" type="submit">
          Create Spot
        </button>
      </form>
    </div>
  );
}

export default CreateSpot;
