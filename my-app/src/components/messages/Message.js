import React from "react";

import classes from "./Message.module.css";

const Message = (props) => {
  return (
    <div
      className={
        props.amIAuthor ? classes["my--msg"] : [classes["friend--msg"]]
      }
    >
      {props.children}
    </div>
  );
};

export default Message;
