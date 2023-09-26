function CreateSpot() {
  return (
    <div>
      <h2>Create a new Spot</h2>
      <form>
        <div className="section-1">
          <h3>Where's your place located?</h3>
          <p>
            Guests will only get your exact address once they booked a
            reservation.
          </p>
          <div>
            <label>Country</label>
            <input placeholder="Country" id="country" type="text" />
          </div>
          <div>
            <label>Street Address</label>
            <input placeholder="Address" id="address" type="text" />
          </div>
          <div>
            <label>City</label>
            <input placeholder="City" id="city" type="text" />
          </div>
          <div>
            <label>State</label>
            <input placeholder="State" id="state" type="text" />
          </div>
        </div>
        <div className="section-2">
          <h3>Describe your place to guests</h3>
          <p>
            Mention the best features of your space, any special amentities like
            fast wifi or parking, and what you love about the neighborhood.
          </p>
          <textarea
            placeholder="Please write atleast 30 characters"
            id="describe"
          />
        </div>
        <div className="section-3">
          <h3>Create a title for your spot</h3>
          <p>
            Catch guests' attention with a spot title that highlights what makes
            your place special.
          </p>
          <input placeholder="Name of your spot" id="name" type="text" />
        </div>
        <div className="section-4">
          <h3>Set a base price for your spot</h3>
          <p>
            Competitive pricing can help your listing stand out and rank higher
            in search results.
          </p>
          <label>$ </label>
          <input placeholder="Price per night (USD)" id="price" type="number" />
        </div>
        <div className="section-5">
          <h3>Liven up your spot with photos</h3>
          <p>Submit a link to at least one photo to publish your spot.</p>
          <input placeholder="Preview Image URL" type="text" />
          <input placeholder="Image URL" type="text" />
          <input placeholder="Image URL" type="text" />
          <input placeholder="Image URL" type="text" />
          <input placeholder="Image URL" type="text" />
        </div>
        <button>Create Spot</button>
      </form>
    </div>
  );
}

export default CreateSpot;
