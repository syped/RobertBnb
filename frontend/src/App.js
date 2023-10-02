import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import SpotPage from "./components/SpotPage";
import ManageSpots from "./components/ManageSpots";
import CreateSpot from "./components/CreateSpot";
import UpdateSpot from "./components/UpdateSpot";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/spots/new" component={CreateSpot} />
          <Route path="/spots/current" component={ManageSpots} />
          <Route path="/spots/:spotId/edit" component={UpdateSpot} />
          <Route path="/spot/:spotId" component={SpotPage} />
          <Route>Page Not Found</Route>
        </Switch>
      )}
    </>
  );
}

export default App;
