import React from "react";
import { Link } from "react-router-dom";

import classes from "./SportsManEl.module.css";

const SportsManEl = (props) => {
  const path = `/mysportsman/${props.id}`;

  return (
    <div className={classes["sportsman--el--wrapper"]}>
      <img
        src={props.avatarUrl}
        className={classes["sportsman--avatar"]}
        alt=""
      />
      <div className={classes["sportsman--name"]}>{props.name}</div>

      <Link to={path}>
        <button className={classes["sportsman--results--btn"]}>Wyniki</button>
      </Link>
    </div>
  );
};

export default SportsManEl;
