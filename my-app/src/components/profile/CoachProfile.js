import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { API_URL, AVATAR_URL } from "../../conf";

import AuthContext from "../../store/AuthContext";

import classes from "./CoachProfile.module.css";

const initialCoachProfile = {
  user: -1,
  name: "",
  last_name: "",
  avatar: "",
};

const CoachProfile = (props) => {
  const { authTokens } = useContext(AuthContext);

  const [coachProfile, setCoachProfile] = useState(initialCoachProfile);
  const [avatar, setAvatar] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    getCoachProfile();
  }, []);

  const getCoachProfile = async () => {
    const response = await fetch(API_URL + "coachprofile/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      setCoachProfile(data);
    } else {
      navigate("/");
      alert("Nie udało się wczytać profilu!");
    }
  };

  const changeNameHandler = (event) => {
    setCoachProfile((prevCoachProfile) => ({
      ...prevCoachProfile,
      name: event.target.value,
    }));
  };

  const changeLastNameHandler = (event) => {
    setCoachProfile((prevCoachProfile) => ({
      ...prevCoachProfile,
      last_name: event.target.value,
    }));
  };

  const uploadPicture = (e) => {
    setAvatar({
      currentFile: e.target.files[0],
      previewImage: URL.createObjectURL(e.target.files[0]),
    });
  };

  const profileUpdateHandler = async () => {
    if (coachProfile.name.length > 50)
      alert("Imię jest zbyt długie! (Maksymalnie 50 znaków)");
    else if (coachProfile.last_name.length > 50)
      alert("Nazwisko jest zbyt długie! (Maksymalnie 50 znaków)");
    else {
      let formData = new FormData();

      formData.append("name", coachProfile.name);
      formData.append("last_name", coachProfile.last_name);

      if (avatar?.currentFile) formData.append("avatar", avatar.currentFile);

      const response = await fetch(API_URL + "coachprofile_edit/", {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + String(authTokens.access),
        },
        body: formData,
      });

      if (response.status === 200) {
        const data = await response.json();
        setCoachProfile({
          name: data.name,
          last_name: data.last_name,
          avatar: data.avatar,
        });
        alert("Pomyślnie zaktualizowano profil!");
      } else alert("Nie udało się zaktualizować profilu!");
    }
  };

  const avatarUrl = avatar?.previewImage || AVATAR_URL + coachProfile.avatar;

  return (
    <div className={classes["coach--profile--wrapper"]}>
      <button onClick={profileUpdateHandler} className={classes["save--btn"]}>
        Zapisz zmiany
      </button>
      <hr />
      <img
        src={coachProfile.avatar && avatarUrl}
        className={classes["profile--img"]}
        alt=""
      />
      <label className={classes["profile--img--upload"]}>
        Zmień avatar
        <input type="file" onChange={uploadPicture} />
      </label>
      <hr />
      <input
        className={classes["name--input"]}
        value={coachProfile.name}
        placeholder="Imię"
        onChange={changeNameHandler}
      />
      <input
        className={classes["name--input"]}
        value={coachProfile.last_name}
        placeholder="Nazwisko"
        onChange={changeLastNameHandler}
      />
      <hr />
      <Link to="/">
        <button className={classes["workout--overview--btn"]}>
          MOI ZAWODNICY
        </button>
      </Link>
    </div>
  );
};

export default CoachProfile;
