 import { useRef } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthProvider.js";

function Login({ activeForm, setActiveForm }) {
  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const { login } = useAuth();

  async function handleLoginSubmit(e) {
    e.preventDefault();

    const username = usernameInputRef.current?.value || "";
    const password = passwordInputRef.current?.value || "";

    try {
      const response = await axios.post(
        "/user/login",
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        login(response.data);

        if (usernameInputRef.current) {
          usernameInputRef.current.value = "";
        }

        if (passwordInputRef.current) {
          passwordInputRef.current.value = "";
        }
      } else {
        console.log("Incorrect Username or Password");
      }
    } catch (e) {
      console.log("error:", e);
      console.log("server response:", e.response?.data);
    }
  }

  return (
    <div
      className={`form-box login ${
        activeForm === "login" ? "active" : "inactive-left"
      }`}
    >
      <form onSubmit={handleLoginSubmit}>
        <h1 style={{ marginBottom: "30px" }}>Login</h1>

        <calcite-input
          ref={usernameInputRef}
          type="text"
          name="username"
          placeholder="Username"
          autocomplete="username"
          icon="user"
          full-width
        />

        <calcite-input
          ref={passwordInputRef}
          type="password"
          name="password"
          placeholder="Password"
          autocomplete="current-password"
          icon="lock"
          full-width
        />

        <calcite-button
          type="submit"
          width="full"
          kind="brand"
          style={{ marginTop: "20px" }}
        >
          Login
        </calcite-button>

        <label
          className="form-label-register"
          htmlFor="go2register"
        >
          Don't have an account?
        </label>

        <calcite-button
          id="go2register"
          type="button"
          appearance="outline"
          width="full"
          kind="brand"
          onClick={() => setActiveForm("register")}
        >
          Go to Register
        </calcite-button>
      </form>
    </div>
  );
}

export default Login;