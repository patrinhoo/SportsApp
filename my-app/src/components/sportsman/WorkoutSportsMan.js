import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AuthContext from "../../store/AuthContext";

import { API_URL } from "../../conf";

import classes from "./WorkoutSportsMan.module.css";

const WorkoutSportsMan = (props) => {
  const [workout, setWorkout] = useState({});

  const { id } = useParams();
  const { authTokens } = useContext(AuthContext);

  const navigate = useNavigate();

  const no_comment_msg = "Trener nie dodał jeszcze komentarza do tego treningu";

  useEffect(() => {
    getWorkout();
  }, []);

  const getWorkout = async () => {
    const response = await fetch(API_URL + `workouts/${id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      setWorkout(data);
    } else {
      navigate("/");
      alert("Nie udało się wczytać treningu!");
    }
  };

  const workoutDurationHours = parseInt(workout?.duration?.split(":")[0]);
  const workoutDurationMins = parseInt(workout?.duration?.split(":")[1]);
  const workoutDurationSecs = parseInt(workout?.duration?.split(":")[2]);

  const workoutDuration =
    workoutDurationHours !== 0 ||
    workoutDurationMins !== 0 ||
    workoutDurationSecs !== 0
      ? `${workoutDurationHours}h ${workoutDurationMins}min ${workoutDurationSecs}s`
      : "Trening nie został jeszcze ukończony";

  const workoutMark =
    workout.mark !== 0
      ? workout.mark + " / 10"
      : "Trening nie został jeszcze oceniony!";

  return (
    <div className={classes["workout--el--wrapper"]}>
      <div className={classes["workout--title--wrapper"]}>
        <div className={classes["workout--title--header"]}>
          ZADANIE TRENINGOWE
        </div>
        <div className={classes["workout--title"]}>{workout.title}</div>
      </div>
      <div className={classes["workout--time--wrapper"]}>
        <div className={classes["workout--time--header"]}>
          PRZEWIDYWANY CZAS
        </div>
        <div className={classes["workout--time"]}>
          {workout.expected_duration}
        </div>
      </div>
      <div className={classes["workout--time--wrapper"]}>
        <div className={classes["workout--time--header"]}>UZYSKANY CZAS</div>
        <div className={classes["workout--time"]}>{workoutDuration}</div>
      </div>
      <div className={classes["workout--date--wrapper"]}>
        <div className={classes["workout--date--header"]}>DATA TRENINGU</div>
        <div className={classes["workout--date"]}>{workout.date}</div>
      </div>
      <div className={classes["workout--mark--wrapper"]}>
        <div className={classes["workout--mark--header"]}>OCENA</div>
        <div className={classes["workout--mark"]}>{workoutMark}</div>
      </div>
      <div className={classes["workout--comment--wrapper"]}>
        <div className={classes["workout--comment--header"]}>
          KOMENTARZ TRENERA
        </div>
        <div className={classes["workout--comment"]}>
          {workout.comment || no_comment_msg}
        </div>
      </div>
    </div>
  );
};

export default WorkoutSportsMan;
