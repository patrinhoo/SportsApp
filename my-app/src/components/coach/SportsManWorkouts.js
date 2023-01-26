import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { API_URL, AVATAR_URL } from "../../conf";

import AuthContext from "../../store/AuthContext";

import classes from "./SportsManWorkouts.module.css";

import WorkoutEl from "../sportsman/WorkoutEl";
import Modal from "../UI/Modal";
import NewWorkout from "./NewWorkout";

function isValidDate(date) {
  // Date format: YYYY-MM-DD
  const datePattern = /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;

  // Check if the date string format is a match
  const matchArray = date.match(datePattern);
  if (matchArray == null) {
    return false;
  }

  // Remove any non digit characters
  const dateString = date.replace(/\D/g, "");

  // Parse integer values from the date string
  const year = parseInt(dateString.substr(0, 4));
  const month = parseInt(dateString.substr(4, 2));
  const day = parseInt(dateString.substr(6, 2));

  // Define the number of days per month
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Leap years
  if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
    daysInMonth[1] = 29;
  }

  if (month < 1 || month > 12 || day < 1 || day > daysInMonth[month - 1]) {
    return false;
  }
  return true;
}

const SportsManWorkouts = (props) => {
  const [workouts, setWorkouts] = useState([]);
  const [sportsManProfile, setSportsManProfile] = useState({});
  const [showModal, setShowModal] = useState(false);

  const { authTokens } = useContext(AuthContext);
  const { id } = useParams();

  const navigate = useNavigate();

  const workoutElements = workouts.map((workout) => (
    <WorkoutEl key={workout.id} workout={workout} />
  ));

  useEffect(() => {
    getWorkouts();
  }, []);

  const getWorkouts = async () => {
    const response = await fetch(API_URL + `mysportsman_workouts/${id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });

    if (response.status === 200) {
      const data = await response.json();

      setWorkouts(data.workouts);
      setSportsManProfile(data.sportsman);
    } else {
      navigate("/");
      alert("Podczas wczytywania treningów wystąpił błąd!");
    }
  };

  const addWorkoutHandler = async (title, duration, date) => {
    if (title.length > 100)
      alert("Tytuł treningu jest zbyt długi! (Max 100 znaków)");
    else if (title.length === 0) alert("Uzupełnij tytuł treningu!");
    else if (duration.length > 50)
      alert("Długość treningu jest niepoprawna! (Max 50 znaków)");
    else if (duration.length === 0) alert("Uzupełnij długość treningu!");
    else if (!isValidDate(date)) alert("Data treningu jest niepoprawna!");
    else {
      const response = await fetch(API_URL + `add_workout/${id}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
        body: JSON.stringify({
          title: title,
          duration: duration,
          date: date,
        }),
      });

      if (response.status === 201) {
        alert("Pomyślnie dodano trening!");
      } else alert("Nie udało się dodać treningu!");

      getWorkouts();
      setShowModal(false);
    }
  };

  const showModalHandler = () => {
    setShowModal(true);
  };

  const closeModalHandler = () => {
    setShowModal(false);
  };

  const avatarUrl = AVATAR_URL + sportsManProfile.avatar;

  return (
    <React.Fragment>
      {showModal && (
        <Modal onClose={closeModalHandler}>
          <NewWorkout
            sportsManProfile={sportsManProfile}
            addNewWorkout={addWorkoutHandler}
          />
        </Modal>
      )}

      <div className={classes["last--workouts--wrapper"]}>
        <header className={classes["last--workouts--title"]}>
          OSTATNIE TRENINGI ZAWODNIKA
          <hr />
          <div className={classes["last--workouts--sportsman"]}>
            {sportsManProfile.name} {sportsManProfile.last_name}
          </div>
          <img
            src={sportsManProfile.avatar && avatarUrl}
            className={classes["profile--img"]}
            alt=""
          />
        </header>

        <button
          onClick={showModalHandler}
          className={classes["add--workout--btn"]}
        >
          Dodaj Trening
        </button>

        <hr />

        {workoutElements}
      </div>
    </React.Fragment>
  );
};

export default SportsManWorkouts;
