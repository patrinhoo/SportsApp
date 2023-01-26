import React, { useContext } from "react";

import AuthContext from "../store/AuthContext";

import MySportsMenReport from "../components/report/MySportsMenReport";

const MySportsManReportPage = (props) => {
  const { user } = useContext(AuthContext);

  return (
    <React.Fragment>
      <MySportsMenReport />
    </React.Fragment>
  );
};

export default MySportsManReportPage;
