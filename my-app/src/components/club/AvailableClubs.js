import React, { useState, useContext, useEffect } from "react";

import { API_URL } from "../../conf";

import classes from "./AvailableClubs.module.css";

import AuthContext from "../../store/AuthContext";

import AvailableClubEl from "./AvailableClubEl";

const AvailableClubs = (props) => {
  const [clubs, setClubs] = useState([]);

  const { authTokens } = useContext(AuthContext);

  const clubsElements = clubs.map((club) => (
    <AvailableClubEl key={club.id} club={club} />
  ));

  useEffect(() => {
    getClubs();
  }, []);

  const getClubs = async () => {
    const response = await fetch(API_URL + "clubs/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      setClubs(data);
    } else alert("Podczas wczytywania klubów wystąpił błąd!");
  };

  return (
    <div className={classes["available--clubs--wrapper"]}>
      <header className={classes["available--clubs--title"]}>KLUBY</header>
      <hr />

      {clubsElements}
    </div>
  );
};

export default AvailableClubs;
