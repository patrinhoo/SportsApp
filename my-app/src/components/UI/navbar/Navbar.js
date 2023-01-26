import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { API_URL } from "../../../conf";

import classes from "./Navbar.module.css";

import AuthContext from "../../../store/AuthContext";

const Navbar = (props) => {
  const [unseenMessages, setUnseenMessages] = useState(0);

  const { user, logoutUser, authTokens } = useContext(AuthContext);

  useEffect(() => {
    if (user) getUnseenMessages();
  }, [user]);

  const getUnseenMessages = async () => {
    const response = await fetch(API_URL + `unseen_messages/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens?.access),
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      setUnseenMessages(data.unseen);
    } else alert("Nie udało się wczytać nieodczytanych wiadomości!");
  };

  return (
    <nav className={classes.navbar}>
      <div className={classes.logo}>
        {user && <Link to="/">Runners App</Link>}
        {!user && <Link to="/login">Runners App</Link>}
      </div>
      <div className={classes["action-btns"]}>
        {user && (
          <Link to="/messages">
            <button className={classes["results--btn"]}>
              {unseenMessages} &#9993;
            </button>
          </Link>
        )}
        {user && (
          <Link to="/profile">
            <button className={classes["profile--btn"]}>Profil</button>
          </Link>
        )}
        {user && (
          <button onClick={logoutUser} className={classes["logout--btn"]}>
            Wyloguj
          </button>
        )}
        {!user && (
          <Link to="/register">
            <button className={classes["profile--btn"]}>Rejestracja</button>
          </Link>
        )}
        {!user && (
          <Link to="/login">
            <button className={classes["logout--btn"]}>Zaloguj</button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
