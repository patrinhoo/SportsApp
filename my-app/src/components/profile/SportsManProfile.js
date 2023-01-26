import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { API_URL, AVATAR_URL } from "../../conf";

import AuthContext from "../../store/AuthContext";

import classes from "./SportsManProfile.module.css";

const initialSportsManProfile = {
  user: -1,
  name: "",
  last_name: "",
  avatar: "",
  coach: -1,
};

const SportsManProfile = (props) => {
  const { authTokens } = useContext(AuthContext);

  const [sportsManProfile, setSportsManProfile] = useState(
    initialSportsManProfile
  );

  const [club, setClub] = useState();
  const [avatar, setAvatar] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    getSportsManProfile();
  }, []);

  const getSportsManProfile = async () => {
    const response = await fetch(API_URL + "sportsmanprofile/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });

    if (response.status === 200) {
      const data = await response.json();

      setSportsManProfile(data);

      if (data.club) {
        const response2 = await fetch(API_URL + `club/${data.club}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        });

        if (response2.status === 200) {
          const data2 = await response2.json();
          setClub(data2);
        } else alert("Nie udało się załadować klubu!");
      }
    } else {
      navigate("/");
      alert("Nie udało się wczytać profilu!");
    }
  };

  const changeNameHandler = (event) => {
    setSportsManProfile((prevSportsManProfile) => ({
      ...prevSportsManProfile,
      name: event.target.value,
    }));
  };

  const changeLastNameHandler = (event) => {
    setSportsManProfile((prevSportsManProfile) => ({
      ...prevSportsManProfile,
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
    if (sportsManProfile.name.length > 50)
      alert("Imię jest zbyt długie! (Maksymalnie 50 znaków)");
    else if (sportsManProfile.last_name.length > 50)
      alert("Nazwisko jest zbyt długie! (Maksymalnie 50 znaków)");
    else {
      let formData = new FormData();

      formData.append("name", sportsManProfile.name);
      formData.append("last_name", sportsManProfile.last_name);

      if (avatar?.currentFile) formData.append("avatar", avatar.currentFile);

      const response = await fetch(API_URL + "sportsmanprofile_edit/", {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + String(authTokens.access),
        },
        body: formData,
      });

      if (response.status === 200) {
        const data = await response.json();

        setSportsManProfile({
          name: data.name,
          last_name: data.last_name,
          avatar: data.avatar,
        });
        alert("Pomyślnie zaktualizowano profil!");
      } else alert("Nie udało się zaktualizować profilu!");
    }
  };

  const leaveClubHandler = async () => {
    const response = await fetch(API_URL + "leave_club/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      setSportsManProfile(data);
      setClub();
      alert("Pomyślnie opuszczono klub!");
    } else alert("Nie udało się opuścić klubu!");
  };

  const avatarUrl =
    avatar?.previewImage || AVATAR_URL + sportsManProfile?.avatar;

  const actualClubSection = (
    <React.Fragment>
      <input className={classes["club--input"]} readOnly value={club?.name} />

      <button
        onClick={leaveClubHandler}
        className={classes["leave--club--btn"]}
      >
        OPUŚĆ KLUB
      </button>
      <hr />
    </React.Fragment>
  );

  const joinClubSection = (
    <React.Fragment>
      <Link to="/join_club">
        <button className={classes["leave--club--btn"]}>DOŁĄCZ DO KLUBU</button>
      </Link>
      <hr />
    </React.Fragment>
  );

  return (
    <div className={classes["sportsman--profile--wrapper"]}>
      <button onClick={profileUpdateHandler} className={classes["save--btn"]}>
        Zapisz zmiany
      </button>
      <hr />
      <img
        src={sportsManProfile?.avatar && avatarUrl}
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
        value={sportsManProfile.name}
        placeholder="Imię"
        onChange={changeNameHandler}
      />
      <input
        className={classes["name--input"]}
        value={sportsManProfile.last_name}
        placeholder="Nazwisko"
        onChange={changeLastNameHandler}
      />
      <hr />

      {club && actualClubSection}
      {!club && joinClubSection}

      <Link to="/">
        <button className={classes["workout--overview--btn"]}>
          PRZEGLĄDAJ TRENINGI
        </button>
      </Link>
    </div>
  );
};

export default SportsManProfile;
