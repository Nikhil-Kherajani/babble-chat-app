import React, { useEffect, useState } from "react";
import { user } from "../Join/Join";
import socketIo from "socket.io-client";
import "./Chat.css";
import sendLogo from "../../images/send.png";
import Message from "../Message/Message";
import ReactScrollToBottom from "react-scroll-to-bottom";
import closeIcon from "../../images/closeIcon.png";

let socket;

// const ENDPOINT = "https://babblechatapp1.herokuapp.com/";
const ENDPOINT = "https://babble-chat-app-production.up.railway.app/";



const Chat = () => {
  const [id, setid] = useState("");
  const [messages, setMessages] = useState([]);
  const [warningcount, setwarningcount] = useState(3);

  const send = () => {
    const message = document.getElementById("chatInput").value;
    if (message !== "") {
      if (
        warningcount > 0 &&
        !message.includes("fuck") &&
        !message.includes("Fuck") &&
        !message.includes("shit") &&
        !message.includes("dick") &&
        !message.includes("asshole") &&
        !message.includes("bitch") &&
        !message.includes("idiot") &&
        !message.includes("loser") &&
        !message.includes("Loser") &&
        !message.includes("nigga") &&
        !message.includes("suck") &&
        !message.includes("cock") &&
        !message.includes("tits") &&
        !message.includes("boner") &&
        !message.includes("pussy") &&
        !message.includes("ass") &&
        !message.includes("death") &&
        !message.includes("astard") &&
        !message.includes("uicide") &&
        !message.includes("murder") &&
        !message.includes("Murder") &&
        !message.includes("dumb") &&
        !message.includes("nerd") &&
        !message.includes("jerk") &&
        !message.includes("coward")
      ) {
        socket.emit("message", { message, id });
        document.getElementById("chatInput").value = "";
      } else if (warningcount == 0 || warningcount < 0) {
        alert("Sorry you are not allowed to send messages");
      } else {
        setwarningcount(warningcount - 1);
        alert(`please don't use abusive words, warning left ${warningcount}`);
      }
    }
  };

  console.log(messages);
  useEffect(() => {
    socket = socketIo(ENDPOINT, { transports: ["websocket"] });

    socket.on("connect", () => {
      // alert("Connected");
      setid(socket.id);
    });
    console.log(socket);
    socket.emit("joined", { user });

    socket.on("welcome", (data) => {
      setMessages([...messages, data]);
      console.log(data.user, data.message);
    });

    socket.on("userJoined", (data) => {
      setMessages([...messages, data]);
      console.log(data.user, data.message);
    });

    socket.on("leave", (data) => {
      setMessages([...messages, data]);
      console.log(data.user, data.message);
    });

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, []);

  useEffect(() => {
    socket.on("sendMessage", (data) => {
      setMessages([...messages, data]);
      console.log(data.user, data.message, data.id);
    });
    return () => {
      socket.off();
    };
  }, [messages]);

  return (
    <div className="chatPage">
      <div className="chatContainer">
        <div className="header">
          <h2>Babble : Live group chat</h2>
          <a href="/">
            {" "}
            <img src={closeIcon} alt="Close" />
          </a>
        </div>
        <ReactScrollToBottom className="chatBox">
          {messages.map((item, i) => (
            <Message
              user={item.id === id ? "" : item.user}
              message={item.message}
              classs={item.id === id ? "right" : "left"}
            />
          ))}
        </ReactScrollToBottom>
        <div className="inputBox">
          <input
            onKeyUp={(event) => (event.key === "Enter" ? send() : null)}
            type="text"
            id="chatInput"
          />
          <button onClick={send} className="sendBtn">
            <img src={sendLogo} alt="Send" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
