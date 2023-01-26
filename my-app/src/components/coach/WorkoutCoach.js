import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { API_URL, AVATAR_URL } from "../../conf";

import AuthContext from "../../store/AuthContext";

import classes from "./WorkoutCoach.module.css";

const WorkoutCoach = (props) => {
  const [workout, setWorkout] = useState({});
  const [sportsManProfile, setSportsManProfile] = useState({});
  const [workoutHours, setWorkoutHours] = useState(0);
  const [workoutMins, setWorkoutMins] = useState(0);
  const [workoutSeconds, setWorkoutSeconds] = useState(0);

  const { id } = useParams();
  const { authTokens } = useContext(AuthContext);

  const navigate = useNavigate();

  const no_comment_msg = "Dodaj komentarz do tego treningu";

  useEffect(() => {
    getWorkout();
  }, []);

  const getWorkout = async () => {
    const response = await fetch(API_URL + `workouts_coach/${id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });

    if (response.status === 200) {
      const data = await response.json();

      setWorkout(data.workout);
      setSportsManProfile(data.sportsman);

      const workoutDurationHours = parseInt(
        data.workout?.duration?.split(":")[0]
      );
      const workoutDurationMins = parseInt(
        data.workout?.duration?.split(":")[1]
      );
      const workoutDurationSecs = parseInt(
        data.workout?.duration?.split(":")[2]
      );

      setWorkoutHours(workoutDurationHours);
      setWorkoutMins(workoutDurationMins);
      setWorkoutSeconds(workoutDurationSecs);
    } else {
      navigate("/");
      alert("Poczas wczytywania treningu wystąpił błąd!");
    }
  };

  const changeCommentHandler = (event) => {
    setWorkout((prevWorkout) => ({
      ...prevWorkout,
      comment: event.target.value,
    }));
  };

  const changeMarkHandler = (event) => {
    setWorkout((prevWorkout) => ({
      ...prevWorkout,
      mark: event.target.value,
    }));
  };

  const changeHoursHandler = (event) => {
    setWorkoutHours(event.target.value);
  };

  const changeMinsHandler = (event) => {
    setWorkoutMins(event.target.value);
  };

  const changeSecondsHandler = (event) => {
    setWorkoutSeconds(event.target.value);
  };

  const commentWorkoutHandler = async (e) => {
    e.preventDefault();
    if (workout.comment.length > 100)
      alert("Komentarz jest zbyt długi! (Maksymalnie 100 znaków)");
    else {
      const response = await fetch(API_URL + `comment/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
        body: JSON.stringify({
          comment: workout.comment,
        }),
      });

      if (response.status === 200) {
        alert("Pomyślnie dodano komentarz!");
      } else alert("Nie udało się skomentować!");
    }
  };

  const markWorkoutHandler = async (e) => {
    e.preventDefault();
    if (workout.mark < 0 || workout.mark > 10)
      alert("Ocena musi być z przedziału 0-10! (0 oznacza brak oceny)");
    else {
      const response = await fetch(API_URL + `mark/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
        body: JSON.stringify({
          mark: workout.mark,
        }),
      });

      if (response.status === 200) {
        alert("Pomyślnie oceniono trening!");
      } else alert("Nie udało się ocenić treningu!");
    }
  };

  const resultWorkoutHandler = async (e) => {
    e.preventDefault();
    if (workoutHours > 23) alert("Trening musi być krótszy niż 24h!");
    else if (workoutHours < 0) alert("Liczba godzin nie może być ujemna!");
    else if (workoutMins > 59) alert("Liczba minut musi być mniejsza niż 60!");
    else if (workoutMins < 0) alert("Liczba minut nie może być ujemna!");
    else if (workoutSeconds > 59)
      alert("Liczba sekund musi być mniejsza niż 60!");
    else if (workoutSeconds < 0) alert("Liczba sekund nie może być ujemna!");
    else {
      const response = await fetch(API_URL + `result/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
        body: JSON.stringify({
          hours: workoutHours,
          mins: workoutMins,
          seconds: workoutSeconds,
        }),
      });

      if (response.status === 200) {
        alert("Pomyślnie uzupełniono wynik treningu!");
      } else alert("Nie udało się uzupełnić wyniku treningu!");
    }
  };

  const avatarUrl = AVATAR_URL + sportsManProfile.avatar;

  return (
    <div className={classes["workout--el--wrapper"]}>
      <div className={classes["workout--sportsman--wrapper"]}>
        <div className={classes["workout--title--header"]}>
          {sportsManProfile.name} {sportsManProfile.last_name}
        </div>
        <img
          src={sportsManProfile.avatar && avatarUrl}
          className={classes["profile--img"]}
          alt=""
        />
      </div>
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
        <div className={classes["workout--time"]}>
          <input
            value={workoutHours}
            onChange={changeHoursHandler}
            min={0}
            max={23}
            type="number"
            className={classes["workout--result"]}
          />
          h
          <input
            value={workoutMins}
            onChange={changeMinsHandler}
            min={0}
            max={59}
            type="number"
            className={classes["workout--result"]}
          />
          min
          <input
            value={workoutSeconds}
            onChange={changeSecondsHandler}
            min={0}
            max={59}
            type="number"
            className={classes["workout--result"]}
          />
          s
        </div>
        <button
          className={classes["workout--mark--btn"]}
          onClick={resultWorkoutHandler}
        >
          ZAPISZ WYNIK
        </button>
      </div>
      <div className={classes["workout--date--wrapper"]}>
        <div className={classes["workout--date--header"]}>DATA TRENINGU</div>
        <div className={classes["workout--date"]}>{workout.date}</div>
      </div>
      <div className={classes["workout--mark--wrapper"]}>
        <div className={classes["workout--mark--header"]}>OCENA</div>
        <input
          value={workout.mark || 0}
          onChange={changeMarkHandler}
          min={0}
          max={10}
          type="number"
          className={classes["workout--mark"]}
        />
        <button
          className={classes["workout--mark--btn"]}
          onClick={markWorkoutHandler}
        >
          OCEŃ
        </button>
      </div>
      <div className={classes["workout--comment--wrapper"]}>
        <div className={classes["workout--comment--header"]}>KOMENTARZ</div>
        <textarea
          className={classes["workout--comment--input"]}
          placeholder={no_comment_msg}
          value={workout.comment || ""}
          onChange={changeCommentHandler}
        />
        <button
          className={classes["workout--comment--btn"]}
          onClick={commentWorkoutHandler}
        >
          Komentuj...
        </button>
      </div>
    </div>
  );
};

export default WorkoutCoach;
