import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, FormGroup, Label, Spinner } from "reactstrap";
import axios from "../utils/axios";
import "./LoginForm.scss";

function LoginForm(props) {
  const [loading, setLoading] = useState(false);
  const { history } = props;
  const { handleSubmit, register, errors, setError } = useForm();
  const isRegistering = history.location.pathname === "/register";

  const onSubmit = (values) => {
    setLoading(true);
    const url = isRegistering ? "/api/register" : "/api/login";
    axios
      .post(url, values)
      .then((res) => {
        console.log(res);
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
            type="username"
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
