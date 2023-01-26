import React from "react";
import { Link } from "react-router-dom";

import classes from "./WorkoutEl.module.css";

const WorkoutEl = (props) => {
  const path = `/workout/${props.workout.id}`;

  return (
    <div className={classes["workout--el--wrapper"]}>
      <div className={classes["workout--title"]}>{props.workout.title}</div>
      <div className={classes["workout--time"]}>
        {props.workout.expected_duration}
      </div>
      <div className={classes["workout--date"]}>{props.workout.date}</div>
      <Link to={path}>
        <button className={classes["workout--details--btn"]}>Zobacz</button>
      </Link>
    </div>
  );
};

export default WorkoutEl;
