import React, { useContext } from "react";

import AuthContext from "../store/AuthContext";

import SportsManProfile from "../components/profile/SportsManProfile";
import CoachProfile from "../components/profile/CoachProfile";

const ProfilePage = (props) => {
  const { user } = useContext(AuthContext);

  return (
    <React.Fragment>
      {user.coach && <CoachProfile />}
      {!user.coach && <SportsManProfile />}
    </React.Fragment>
  );
};

export default ProfilePage;
