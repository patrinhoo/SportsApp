import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_URL } from "../../conf";

import classes from "./Register.module.css";

const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

const Register = (props) => {
  const [coaches, setCoaches] = useState([]);

  const [role, changeRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedCoach, setSelectedCoach] = useState("");

  const navigate = useNavigate();

  const onFormSubmit = (event) => {
    event.preventDefault();
    if (role === "coach") registerCoachHandler();
    else if (role === "sportsman") registerSportsManHandler();
    else alert("Wybierz rolę!");
  };

  const selectRoleHandler = (event) => {
    changeRole(event.target.value);
    if (event.target.value === "sportsman") {
      fetchCoaches();
    }
  };

  const selectCoachHandler = (event) => {
    setSelectedCoach(event.target.value);
  };

  const emailChangeHandler = (event) => {
    setEmail(event.target.value);
  };

  const passwordChangeHandler = (event) => {
    setPassword(event.target.value);
  };

  const password2ChangeHandler = (event) => {
    setPassword2(event.target.value);
  };

  const nameChangeHandler = (event) => {
    setName(event.target.value);
  };

  const lastNameChangeHandler = (event) => {
    setLastName(event.target.value);
  };

  const registerCoachHandler = async () => {
    if (name.length > 50)
      alert("Imię jest zbyt długie! (Maksymalnie 50 znaków)");
    else if (name.length <= 0) alert("Podaj imię!");
    else if (lastName.length > 50)
      alert("Nazwisko jest zbyt długie! (Maksymalnie 50 znaków)");
    else if (lastName.length <= 0) alert("Podaj nazwisko");
    else if (!validateEmail(email)) alert("Email jest niepoprawny!");
    else if (password.length < 8) alert("Hasło jest zbyt krótkie!");
    else if (password !== password2) alert("Hasła muszą być identyczne!");
    else {
      const response = await fetch(API_URL + `coach_register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          password2: password2,
          name: name,
          last_name: lastName,
        }),
      });

      if (response.status === 201) {
        navigate("/login");
        alert("Pomyślnie utworzono użytkownika!");
      } else {
        alert("Nie udało się utworzyć użytkownika!");
      }
    }
  };

  const registerSportsManHandler = async () => {
    if (name.length > 50)
      alert("Imię jest zbyt długie! (Maksymalnie 50 znaków)");
    else if (name.length <= 0) alert("Podaj imię!");
    else if (lastName.length > 50)
      alert("Nazwisko jest zbyt długie! (Maksymalnie 50 znaków)");
    else if (lastName.length <= 0) alert("Podaj nazwisko");
    else if (!validateEmail(email)) alert("Email jest niepoprawny!");
    else if (password.length < 8) alert("Hasło jest zbyt krótkie!");
    else if (password !== password2) alert("Hasła muszą być identyczne!");
    else if (!selectedCoach) alert("Wybierz trenera!");
    else {
      const response = await fetch(API_URL + `sportsman_register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          password2: password2,
          name: name,
          last_name: lastName,
          coach: selectedCoach,
        }),
      });

      if (response.status === 201) {
        navigate("/login");
        alert("Pomyślnie utworzono użytkownika!");
      } else {
        alert("Nie udało się utworzyć użytkownika!");
      }
    }
  };

  const coachesComponent = coaches.map((coach) => (
    <option value={coach.id} key={coach.id}>
      {coach.name} {coach.last_name}
    </option>
  ));

  const fetchCoaches = async () => {
    const response = await fetch(API_URL + `available_coaches/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      setCoaches(data);
    } else {
      alert("Nie udało się załadować dostępnych trenerów!");
    }
  };

  return (
    <form onSubmit={onFormSubmit} className={classes["register--wrapper"]}>
      <div className={classes["register--header"]}>REJESTRACJA</div>
      <hr />
      <input
        className={classes["register--email"]}
        placeholder="Email"
        onChange={emailChangeHandler}
      />
      <input
        type="password"
        className={classes["register--pw"]}
        placeholder="Hasło"
        onChange={passwordChangeHandler}
      />
      <input
        type="password"
        className={classes["register--pw"]}
        placeholder="Powtórz hasło"
        onChange={password2ChangeHandler}
      />

      <input
        className={classes["register--name"]}
        placeholder="Imię"
        onChange={nameChangeHandler}
      />
      <input
        className={classes["register--name"]}
        placeholder="Nazwisko"
        onChange={lastNameChangeHandler}
      />

      <hr />

      <label className={classes["register--label"]}>Rola</label>
      <select
        value={role}
        onChange={selectRoleHandler}
        className={classes["register--select"]}
      >
        <option value="">---</option>
        <option value="sportsman">Sportowiec</option>
        <option value="coach">Trener</option>
      </select>

      {role === "sportsman" && (
        <React.Fragment>
          <label className={classes["register--label"]}>Trener</label>
          <select
            value={selectedCoach}
            onChange={selectCoachHandler}
            className={classes["register--select"]}
          >
            <option value="">---</option>
            {coachesComponent}
          </select>
        </React.Fragment>
      )}

      <button className={classes["register--btn"]}>Zarejestruj</button>
    </form>
  );
};

export default Register;
