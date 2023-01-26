import React, { useContext } from "react";

import AuthContext from "../../store/AuthContext";

import classes from "./Login.module.css";

const Login = (props) => {
  const { loginUser } = useContext(AuthContext);

  return (
    <form onSubmit={loginUser} className={classes["login--wrapper"]}>
      <div className={classes["login--header"]}>LOGIN</div>
      <hr />
      <input
        type="text"
        className={classes["login--email"]}
        name="email"
        placeholder="Email"
      />
      <input
        type="password"
        className={classes["login--pw"]}
        name="password"
        placeholder="Hasło"
      />
      <button className={classes["login--btn"]}>Zaloguj</button>
    </form>
  );
};

export default Login;
