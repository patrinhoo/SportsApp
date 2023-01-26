import React from "react";
import { Link } from "react-router-dom";

import classes from "./ConversationHeader.module.css";

const ConversationHeader = (props) => {
  return (
    <header className={classes["conversation--header"]}>
      <Link to="/messages">
        <button className={classes["back--btn"]}>&#8701;</button>
      </Link>
      <img
        src={props.avatarUrl}
        className={classes["conversation--avatar"]}
        alt=""
      />
      <div className={classes["conversation--friend"]}>{props.friendName}</div>
    </header>
  );
};

export default ConversationHeader;
