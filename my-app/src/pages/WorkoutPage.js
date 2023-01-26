import React, { useContext } from "react";

import AuthContext from "../store/AuthContext";

import WorkoutSportsMan from "../components/sportsman/WorkoutSportsMan";
import WorkoutCoach from "../components/coach/WorkoutCoach";

const WorkoutPage = (props) => {
  const { user } = useContext(AuthContext);

  return (
    <React.Fragment>
      {user.coach && <WorkoutCoach />}
      {!user.coach && <WorkoutSportsMan />}
    </React.Fragment>
  );
};

export default WorkoutPage;
