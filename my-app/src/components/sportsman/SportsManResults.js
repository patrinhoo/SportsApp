import React, { useState, useEffect, useContext } from "react";

import { API_URL } from "../../conf";

import classes from "./SportsManResults.module.css";

import AuthContext from "../../store/AuthContext";

import LastWorkouts from "./LastWorkouts";

const SportsManResults = (props) => {
  const [workouts, setWorkouts] = useState([]);

  const { authTokens } = useContext(AuthContext);

  useEffect(() => {
    getWorkouts();
  }, []);

  const getWorkouts = async () => {
    const response = await fetch(API_URL + "workouts/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      setWorkouts(data);
    } else if (response.status === 204)
      alert("Nie masz jeszcze żadnych treningów!");
    else alert("Nie udało się załadować treningów!");
  };

  return (
    <div className={classes["sportsman--results--wrapper"]}>
      <LastWorkouts workouts={workouts} />
    </div>
  );
};

export default SportsManResults;
