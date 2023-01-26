import React from "react";

import classes from "./ReportEl.module.css";

const ReportEl = (props) => {
  const durationHours = Math.floor(props.workoutItem.duration_avg / 3600);
  const durationMins = Math.floor((props.workoutItem.duration_avg / 60) % 60);
  const durationSeconds = Math.floor(props.workoutItem.duration_avg % 60);

  const durationString = `${durationHours}h ${durationMins}min ${durationSeconds}s`;

  const markString = `${Math.floor(props.workoutItem.mark_avg).toFixed(
    1
  )} / 10`;

  return (
    <div className={classes["report--el--wrapper"]}>
      <div className={classes["report--el--title"]}>
        {props.workoutItem.title}
      </div>

      <hr />

      <div className={classes["report--data--wrapper"]}>
        <div className={classes["workouts--nr"]}>
          <div className={classes["report--data--header"]}>
            Liczba Treningów
          </div>
          <div className={classes["report--data--value"]}>
            {props.workoutItem.workouts_count}
          </div>
        </div>

        <div className={classes["workouts--duration"]}>
          <div className={classes["report--data--header"]}>Średni czas</div>
          <div className={classes["report--data--value"]}>{durationString}</div>
          <hr />
          <div className={classes["report--data--header"]}>Liczba wyników</div>
          <div className={classes["report--data--value"]}>
            {props.workoutItem.duration_count}
          </div>
        </div>

        <div className={classes["workouts--mark"]}>
          <div className={classes["report--data--header"]}>Średnia ocena</div>
          <div className={classes["report--data--value"]}>{markString}</div>
          <hr />
          <div className={classes["report--data--header"]}>Liczba ocen</div>
          <div className={classes["report--data--value"]}>
            {props.workoutItem.mark_count}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportEl;
