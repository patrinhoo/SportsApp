import React, { useContext } from "react";

import AuthContext from "../store/AuthContext";

import SportsManResults from "../components/sportsman/SportsManResults";
import MySportsmen from "../components/coach/MySportsMen";

const MainPage = (props) => {
  const { user } = useContext(AuthContext);

  return (
    <React.Fragment>
      {user.coach && <MySportsmen />}
      {!user.coach && <SportsManResults />}
    </React.Fragment>
  );
};

export default MainPage;
