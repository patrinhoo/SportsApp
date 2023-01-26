import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { API_URL } from "../../conf";

import AuthContext from "../../store/AuthContext";

import classes from "./AvailableClubEl.module.css";

const AvailableClubEl = (props) => {
  const { authTokens } = useContext(AuthContext);

  const navigate = useNavigate();

  const joinClub = async () => {
    const response = await fetch(API_URL + `join_club/${props.club.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      alert("Pomyślnie dołączono do klubu!");
      navigate("/profile");
    } else alert("Nie udało się dołączyć do klubu!");
  };

  return (
    <div className={classes["club--el--wrapper"]}>
      <div className={classes["club--header"]}>
        <div className={classes["club--name"]}>{props.club.name}</div>
        <button onClick={joinClub} className={classes["club--join--btn"]}>
          Dołącz
        </button>
      </div>

      <div className={classes["club--description"]}>
        {props.club.description}
      </div>
    </div>
  );
};

export default AvailableClubEl;
