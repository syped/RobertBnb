import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";
import drink from "../../assets/drinks-svgrepo-com.png";
import logo from "../../assets/valorantlogo.png";

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
      <div>
        <NavLink exact to="/">
          <img src={logo} className="val-logo"></img>
        </NavLink>
      </div>
      {isLoaded && <ProfileButton></ProfileButton>}
    </div>
  );
}

export default Navigation;
