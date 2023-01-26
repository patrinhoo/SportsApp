import React, { useContext, useEffect } from "react";

import AuthContext from "../store/AuthContext";

import AvailableClubs from "../components/club/AvailableClubs";
import { useNavigate } from "react-router-dom";

const JoinClubPage = (props) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.coach) {
      navigate("/");
      alert("Tylko zawodnik może się zapisać do klubu!");
    }
  }, []);

  return <React.Fragment>{!user.coach && <AvailableClubs />}</React.Fragment>;
};

export default JoinClubPage;
