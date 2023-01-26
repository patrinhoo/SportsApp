import React, { useContext } from "react";

import AuthContext from "../store/AuthContext";

import SportsManWorkouts from "../components/coach/SportsManWorkouts";

const MySportsManResultsPage = (props) => {
  const { user } = useContext(AuthContext);

  return <React.Fragment>{user.coach && <SportsManWorkouts />}</React.Fragment>;
};

export default MySportsManResultsPage;
