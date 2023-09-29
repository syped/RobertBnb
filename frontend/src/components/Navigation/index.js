import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
// import "./Navigation.css";
import logo from "../../assets/valbnb.png";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  let sessionLinks;
  //   if (sessionUser) {
  //     sessionLinks = (
  //       <div>
  //         <ProfileButton user={sessionUser} />
  //       </div>
  //     );
  //   } else {
  //     sessionLinks = (
  //       <div className="logincontainer">
  //         <OpenModalButton
  //           buttonText="Log In"
  //           modalComponent={<LoginFormModal />}
  //         />
  //         <OpenModalButton
  //           buttonText="Sign Up"
  //           modalComponent={<SignupFormModal />}
  //         />
  //       </div>
  //     );
  //   }

  return (
    <div className="header">
      <div className="header-content">
        <div>
          <NavLink exact to="/">
            <img src={logo} className="val-logo"></img>
          </NavLink>
        </div>
        {sessionUser ? (
          <div className="nav-menu-right">
            <div className="create-spot">
              <NavLink to="/spots/new">Create a new Spot</NavLink>
            </div>
          </div>
        ) : null}
        {isLoaded && <ProfileButton></ProfileButton>}
      </div>
    </div>
  );
}

export default Navigation;
