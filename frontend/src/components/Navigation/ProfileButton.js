// frontend/src/components/Navigation/ProfileButton.js
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as sessionActions from "../../store/session";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import menuicon from "../../assets/menu.svg";
import { NavLink } from "react-router-dom";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const sessionUser = useSelector((state) => state.session.user);

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      {sessionUser ? (
        <>
          <button onClick={openMenu} className="profile-button">
            <img src={menuicon} className="menu"></img>
            <i className="fas fa-user-circle" />
          </button>
          <div className={ulClassName} ref={ulRef}>
            <div className="dropdowncontainer">
              <li>{sessionUser.username}</li>
              <li>
                {sessionUser.firstName} {sessionUser.lastName}
              </li>
              <li>{sessionUser.email}</li>
              <NavLink to="/spots/current">Manage Spots</NavLink>
              <li>
                <button onClick={logout}>Log Out</button>
              </li>
            </div>
          </div>
        </>
      ) : (
        <>
          <button onClick={openMenu} className="profile-button">
            <img src={menuicon} className="menu"></img>
            <i className="fas fa-user-circle" />
          </button>
          <div className={ulClassName} ref={ulRef}>
            <div className="dropdowncontainer">
              <OpenModalButton
                buttonText="Log In"
                modalComponent={<LoginFormModal />}
              />
              <OpenModalButton
                buttonText="Sign Up"
                modalComponent={<SignupFormModal />}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ProfileButton;
