import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, FormGroup, Label, Spinner } from "reactstrap";

import { useLocalStorage } from "../hooks/useLocalStorage";
import axios from "../utils/axios";
import "./LoginForm.scss";

function LoginForm(props) {
  const { history } = props;
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useLocalStorage("token", "");
  const { handleSubmit, register, errors, setError } = useForm();
  const isRegistering = history.location.pathname === "/register";

  const onSubmit = (values) => {
    setLoading(true);
    const url = isRegistering ? "/api/register" : "/api/login";
    axios()
      .post(url, values)
      .then(({ data }) => {
        if (data.bearer) setToken(data.bearer);
        history.push("/users");
      })
      .catch((err) => console.dir(err));
  };

  return (
    <>
      <form className="form auth-form" onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label for="username">Username</Label>
          <input
            className="form-control"
            name="username"
            type="text"
            id="username"
            ref={register({
              required: "Required",
            })}
          />
          <span className="error">
            {errors.username && errors.username.message}
          </span>
        </FormGroup>
        <FormGroup>
          <Label for="password">Password</Label>
          <input
            className="form-control"
            type="password"
            name="password"
            id="password"
            ref={register({
              required: "Required",
            })}
          />
          <span className="error">
            {errors.password && errors.password.message}
          </span>
        </FormGroup>
        {isRegistering && (
          <FormGroup>
            <Label for="department">department</Label>
            <input
              className="form-control"
              type="text"
              name="department"
              id="department"
              ref={register({
                required: "Required",
              })}
            />
            <span className="error">
              {errors.password && errors.password.message}
            </span>
          </FormGroup>
        )}

        {!loading && (
          <>
            <Button type="submit" color="primary" size="lg" block>
              {isRegistering ? "Register" : "Login"}
            </Button>
            {!isRegistering && (
              <Button
                color="info"
                size="lg"
                block
                onClick={() => history.push("/register")}
              >
                Sign Up
              </Button>
            )}
          </>
        )}
      </form>
      {loading && <Spinner color="primary" />}
    </>
  );
}

export default LoginForm;
