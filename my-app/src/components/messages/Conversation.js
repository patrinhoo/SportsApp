import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { API_URL, AVATAR_URL } from "../../conf";

import AuthContext from "../../store/AuthContext";

import MessageInput from "./MessageInput";
import Message from "./Message";
import ConversationHeader from "./ConversationHeader";
import MessagesWrapper from "./MessagesWrapper";

import classes from "./Conversation.module.css";

const Conversation = (props) => {
  const [messages, setMessages] = useState([]);
  const [interlocutor, setInterlocutor] = useState([]);

  const { authTokens } = useContext(AuthContext);

  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    getConversation();
  }, []);

  const getConversation = async () => {
    const response = await fetch(API_URL + `conversation/${id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });

    if (response.status === 200) {
      const data = await response.json();

      setMessages(data.messages);
      setInterlocutor(data.interlocutor);
    } else {
      navigate("/messages");
      alert("Nie udało się załadować konwersacji!");
    }
  };

  const sendMessage = async (body) => {
    if (body.length > 200) {
      alert("Wiadomość jest zbyt długa! (Max 200 znaków)");
    } else {
      const response = await fetch(API_URL + `send_message/${id}/`, {
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
        getConversation();
      } else alert("Nie udało się wysłać wiadomości!");
    }
  };

  const messagesComponents = messages.map((message) => (
    <Message key={message.id} amIAuthor={message.amIAuthor}>
      {message.body}
    </Message>
  ));

  const friendName = `${interlocutor.name} ${interlocutor.last_name}`;
  const avatarUrl = AVATAR_URL + interlocutor.avatar;

  return (
    <div className={classes["conversation--wrapper"]}>
      {interlocutor.avatar && (
        <ConversationHeader friendName={friendName} avatarUrl={avatarUrl} />
      )}
      <MessagesWrapper>{messagesComponents}</MessagesWrapper>
      <MessageInput onMessageSend={sendMessage} />
    </div>
  );
};

export default Conversation;
