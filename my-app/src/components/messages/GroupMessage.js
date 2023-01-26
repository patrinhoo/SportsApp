import React, { useRef } from "react";

import classes from "./GroupMessage.module.css";

const GroupMessage = (props) => {
  const bodyRef = useRef();

  const onFormSubmit = (event) => {
    event.preventDefault();
    props.onSendGroupMessage(bodyRef.current.value);
  };

  return (
    <form onSubmit={onFormSubmit} className={classes["group-message--wrapper"]}>
      <label className={classes["group-message--label"]}>Wiadomość</label>
      <textarea
        ref={bodyRef}
        className={classes["group-message--body"]}
        placeholder="Napisz wiadomość..."
      />

      <button className={classes["create--workout--btn"]}>Wyślij...</button>
    </form>
  );
};

export default GroupMessage;
