import React, { useState, useEffect, useContext } from "react";

import { API_URL } from "../../conf";

import classes from "./MySportsMenReport.module.css";

import AuthContext from "../../store/AuthContext";

import ReportEl from "./ReportEl";
import { useNavigate } from "react-router-dom";

const MySportsMenReport = (props) => {
  const [workoutItems, setWorkoutItems] = useState([]);

  const { authTokens } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    getWorkoutItems();
  }, []);

  const getWorkoutItems = async () => {
    const response = await fetch(API_URL + "report/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      setWorkoutItems(data);
    } else {
      navigate("/");
      alert("Nie udało się załadować treningów!");
    }
  };

  const workoutElements = workoutItems.map((workoutItem) => (
    <ReportEl key={workoutItem.id} workoutItem={workoutItem} />
  ));

  return (
    <div className={classes["report--wrapper"]}>
      <header className={classes["report--title"]}>
        PODSUMOWANIE TRENINGÓW
      </header>
      <hr />

      {workoutElements}
    </div>
  );
};

export default MySportsMenReport;
