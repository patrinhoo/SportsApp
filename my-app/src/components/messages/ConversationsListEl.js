import React from "react";
import { Link } from "react-router-dom";

import { AVATAR_URL } from "../../conf";

import classes from "./ConversationsListEl.module.css";

const ConversationsListEl = (props) => {
  const imageUrl = AVATAR_URL + props.user?.avatar;
  const friendName = `${props.user?.name} ${props.user?.last_name}`;

  return (
    <Link to={`/messages/${props.user?.id}`}>
      <div className={classes["conversation--header"]}>
        <img
          src={imageUrl}
          className={classes["conversation--avatar"]}
          alt=""
        />
        <div className={classes["conversation--friend"]}>{friendName}</div>

        {props.user?.send_unseen > 0 && (
          <div className={classes["conversation--send--unseen"]}>
            {props.user?.send_unseen} &#9746;
          </div>
        )}

        {props.user?.unseen > 0 && (
          <div className={classes["conversation--unseen"]}>
            {props.user?.unseen} &#9993;
          </div>
        )}
      </div>
    </Link>
  );
};

export default ConversationsListEl;
