import axios from "axios";
import { useRef, useState } from "react";

function Register({ activeForm, setActiveForm }) {
  const [showMessage, setShowMessage] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const infoInputRef = useRef(null);

  const handleUsernameFocus = () => {
    if (usernameError) {
      setUsernameError("");
    }
  };

  async function handleRegisterSubmit(e) {
    e.preventDefault();

    const username = usernameInputRef.current?.value || "";
    const password = passwordInputRef.current?.value || "";
    const info = infoInputRef.current?.value || "";

    try {
      await axios.post(
        "/user/register",
        {
          username,
          password,
          info,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setShowMessage(true);
      setUsernameError("");
    } catch (e) {
      const { data, status } = e.response || {};

      if (status === 409 && data?.field === "username") {
        setUsernameError(data.error);
      }
    }
  }

  const handleCloseMessage = () => {
    setShowMessage(false);
    setUsernameError("");

    if (usernameInputRef.current) {
      usernameInputRef.current.value = "";
    }

    if (passwordInputRef.current) {
      passwordInputRef.current.value = "";
    }

    if (infoInputRef.current) {
      infoInputRef.current.value = "";
    }
  };

  return (
    <div
      className={`form-box register ${
        activeForm === "register"
          ? "active"
          : "inactive-right"
      }`}
    >
      {showMessage && (
        <div className="form-overlay">
          <div className="overlay-content">
            <calcite-icon
              icon="check-circle"
              scale="l"
            />

            <h3>Waiting for Admin Confirmation</h3>

            <div className="call-info">
              <span>
                Your account has been submitted successfully.
                Please wait for admin to confirm it.
              </span>
            </div>

            <calcite-button
              width="full"
              onClick={handleCloseMessage}
            >
              Close Message
            </calcite-button>
          </div>
        </div>
      )}

      <form onSubmit={handleRegisterSubmit}>
        <h1>Registration</h1>

        <calcite-input
          ref={usernameInputRef}
          type="text"
          name="username"
          placeholder="Username"
          autocomplete="off"
          icon="user"
          full-width
          status={usernameError ? "invalid" : "idle"}
          validation-message={usernameError}
          onFocus={handleUsernameFocus}
        />

        <calcite-input
          ref={passwordInputRef}
          type="password"
          name="password"
          placeholder="Password"
          autocomplete="new-password"
          icon="lock"
          full-width
        />

        <calcite-input
          ref={infoInputRef}
          type="text"
          name="info"
          placeholder="Tel number and Unit"
          autocomplete="off"
          icon="phone"
          full-width
        />

        <calcite-button
          type="submit"
          width="full"
        >
          Register
        </calcite-button>

        <label
          className="form-label-login"
          htmlFor="back2login"
        >
          Already have an account?
        </label>

        <calcite-button
          id="back2login"
          type="button"
          appearance="outline"
          width="full"
          onClick={() => setActiveForm("login")}
        >
          Back to Login
        </calcite-button>
      </form>
    </div>
  );
}

export default Register;