import React, { useState, useEffect, useContext } from "react";

import { API_URL } from "../../conf";

import classes from "./ConversationsList.module.css";

import AuthContext from "../../store/AuthContext";
import ConversationsListEl from "./ConversationsListEl";
import Modal from "../UI/Modal";
import GroupMessage from "./GroupMessage";

const ConversationsList = (props) => {
  const [conversationUsers, setConversationUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const { authTokens, user } = useContext(AuthContext);

  useEffect(() => {
    getConversations();
  }, []);

  const getConversations = async () => {
    const response = await fetch(API_URL + `my_conversations/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      setConversationUsers(data);
    } else alert("Nie udało się załadować twoich konwersacji!");
  };

  const sendGroupMessageHandler = async (body) => {
    if (body.length > 200) {
      alert("Wiadomość jest zbyt długa! (Max 200 znaków)");
    } else {
      const response = await fetch(API_URL + `send_group_message/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
        body: JSON.stringify({
          body: body,
        }),
      });

      if (response.status === 201) {
        alert("Pomyślnie wysłano wiadomość grupową!");
      } else alert("Nie udało się wysłać wiadomości grupowej!");

      setShowModal(false);
    }
  };

  const conversationEls =
    conversationUsers &&
    conversationUsers.map((user) => (
      <ConversationsListEl key={user.id} user={user} />
    ));

  const showModalHandler = () => {
    setShowModal(true);
  };

  const closeModalHandler = () => {
    setShowModal(false);
  };

  return (
    <React.Fragment>
      {showModal && (
        <Modal onClose={closeModalHandler}>
          <GroupMessage onSendGroupMessage={sendGroupMessageHandler} />
        </Modal>
      )}

      <div className={classes["conversations--header"]}>MOJE KONWERSACJE</div>
      <div className={classes["conversations--wrapper"]}>
        {user.coach && (
          <div className={classes["group--message"]}>
            <button
              onClick={showModalHandler}
              className={classes["group--message--btn"]}
            >
              WIADOMOŚĆ GRUPOWA
            </button>
          </div>
        )}
        {conversationEls}
      </div>
    </React.Fragment>
  );
};

export default ConversationsList;
