import React from "react";

import classes from "./LastWorkouts.module.css";

import WorkoutEl from "./WorkoutEl";

const LastWorkouts = (props) => {
  const workoutElements = props.workouts.map((workout) => (
    <WorkoutEl key={workout.id} workout={workout} />
  ));

  return (
    <div className={classes["last--workouts--wrapper"]}>
      <header className={classes["last--workouts--title"]}>
        OSTATNIE TRENINGI
      </header>
      <hr />

      {workoutElements}
    </div>
  );
};

export default LastWorkouts;
