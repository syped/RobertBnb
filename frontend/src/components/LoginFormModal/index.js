// frontend/src/components/LoginFormModal/index.js
import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const demoUser = () => {
    setCredential("Demo-lition");
    setPassword("password");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <>
      <h1 className="log-in-header">Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <div className="username-input">
            <input
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              placeholder="Username or Email"
              required
            />
          </div>
        </label>
        <label>
          <div className="password-input">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
        </label>
        {errors.credential && <p className="errors">{errors.credential}</p>}
        <div className="log-in-modal">
          <button
            disabled={credential.length < 4 || password.length < 6}
            type="submit"
          >
            Log In
          </button>
        </div>
        <div className="demo-user-button">
          <button type="submit" onClick={demoUser}>
            Log in as Demo User
          </button>
        </div>
      </form>
    </>
  );
}

export default LoginFormModal;
