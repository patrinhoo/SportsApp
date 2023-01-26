import React, { useRef } from "react";

import classes from "./MessageInput.module.css";

const MessageInput = (props) => {
  const bodyRef = useRef();

  const onSubmitHandler = (event) => {
    event.preventDefault();

    const body = bodyRef.current.value;

    props.onMessageSend(body);
    bodyRef.current.value = "";
  };

  return (
    <form onSubmit={onSubmitHandler} className={classes["msg--form"]}>
      <input
        ref={bodyRef}
        className={classes["msg--input"]}
        placeholder="Napisz wiadomość..."
      />
      <button className={classes["msg--send--btn"]}>Wyślij</button>
    </form>
  );
};

export default MessageInput;
