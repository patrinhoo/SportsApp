import React, { useRef, useEffect } from "react";

import classes from "./MessagesWrapper.module.css";

const MessagesWrapper = (props) => {
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, []);

  return (
    <div className={classes["messages--wrapper"]}>
      {props.children}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessagesWrapper;
