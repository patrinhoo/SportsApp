import React, { useRef } from "react";

import classes from "./NewWorkout.module.css";

const NewWorkout = (props) => {
  const titleRef = useRef();
  const durationRef = useRef();
  const dateRef = useRef();

  const onFormSubmit = (event) => {
    event.preventDefault();
    props.addNewWorkout(
      titleRef.current.value,
      durationRef.current.value,
      dateRef.current.value
    );
  };

  const sportsManFullName = `${props.sportsManProfile.name} ${props.sportsManProfile.last_name}`;

  return (
    <form onSubmit={onFormSubmit} className={classes["conversations--wrapper"]}>
      <input
        ref={titleRef}
        className={classes["workout--name"]}
        placeholder="Tytuł"
      />
      <input
        ref={durationRef}
        className={classes["workout--expected--time"]}
        placeholder="Długość treningu"
      />
      <input ref={dateRef} className={classes["workout--date"]} type="date" />
      <hr />

      <label className={classes["sportsman--target--label"]}>Zawodnik</label>
      <input
        readOnly
        className={classes["sportsman--target"]}
        value={sportsManFullName}
      />
      <hr />

      <button className={classes["create--workout--btn"]}>Utwórz</button>
    </form>
  );
};

export default NewWorkout;
