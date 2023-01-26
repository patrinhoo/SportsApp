import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import { API_URL, AVATAR_URL } from "../../conf";

import classes from "./MySportsMen.module.css";

import AuthContext from "../../store/AuthContext";

import SportsManEl from "./SportsManEl";

const MySportsmen = (props) => {
  const [mySportsMen, setMySportsMen] = useState([]);

  const { authTokens } = useContext(AuthContext);

  const mySportsMenContent = mySportsMen.map((mySportsMan) => (
    <SportsManEl
      key={mySportsMan.id}
      id={mySportsMan.id}
      avatarUrl={AVATAR_URL + mySportsMan.avatar}
      name={mySportsMan.name + " " + mySportsMan.last_name}
    />
  ));

  useEffect(() => {
    getMySportsMen();
  }, []);

  const getMySportsMen = async () => {
    const response = await fetch(API_URL + "mysportsmen/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      setMySportsMen(data);
    } else alert("Podczas wczytywania sportowców wystąpił błąd!");
  };

  return (
    <div className={classes["mysportsmen--wrapper"]}>
      <header className={classes["mysportsmen--title"]}>MOI ZAWODNICY</header>
      <button className={classes["report--btn"]}>
        <Link to="/report">RAPORT</Link>
      </button>
      <hr />
      {mySportsMenContent}
    </div>
  );
};

export default MySportsmen;
