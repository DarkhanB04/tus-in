import { useState, useEffect, useRef } from "react";
import "./Chat.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../../../assets/logo.svg";
import teacherIcon from "../../../assets/teachersx.png";
import { Link } from "react-router-dom";

import axios from "axios";

const API_KEY = "7a42acf8f3a374601d78b15f5dfce724";

function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const messageEnd = useRef(null);

  useEffect(() => {
    messageEnd.current.scrollIntoView();
  }, [messages]);

  const handleSubmit = async () => {
    if (input.trim() === "") return;

    const userMessage = { type: "user", text: input };
    setMessages([...messages, userMessage]);
    setLoading(true);

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=7a42acf8f3a374601d78b15f5dfce724&units=metric`
      );
      const weather = response.data.weather[0].description;
      const temperature = response.data.main.temp;
      const city = response.data.name;
      const botMessage = {
        type: "teacher bot",
        text: `The weather in ${city} is ${weather} with a temperature of ${temperature}°C.`,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      const botMessage = {
        type: "teacher bot",
        text: `Could not retrieve weather for ${input}. Please try another city.`,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      console.log(error);
    } finally {
      setLoading(false);
    }
    setInput("");
  };
  const handleEnter = async (e) => {
    if (e.key == "Enter") await handleSubmit();
  };
  return (
    <>
      <div className="chatbot">
        <div className="sidebar">
          <div className="upper-side">
            <div className="upper-side-header">
              <div className="upper-side-header-logo">
                <img src={logo} alt="" />
              </div>
              <button
                className="new-chat"
                onClick={() => window.location.reload()}
              >
                <FontAwesomeIcon icon="fa-solid fa-plus" /> New chat
              </button>
            </div>
            <div className="upper-side-bottom">
              {messages.length > 0 && (
                <div className="query">
                  <FontAwesomeIcon icon="fa-solid fa-message" />
                  <p>{messages[0].text}</p>
                </div>
              )}
            </div>
          </div>
          <div className="bottom-side">
            <Link to="/">
              <button className="home-btn">
                <FontAwesomeIcon icon="fa-solid fa-door-open" /> Home
              </button>
            </Link>
          </div>
        </div>

        <div className="main">
          <div className="chats">
            {messages.map((message, index) => (
              <div key={index} className={`chat ${message.type}`}>
                {message.type === "teacher bot" && (
                  <div className="teacher-icon">
                    <img src={teacherIcon} alt="" className="teacher-img" />
                  </div>
                )}
                <p className="txt">{message.text}</p>
              </div>
            ))}
            {loading && (
              <div className="chat teacher bot">
                <div className="teacher-icon">
                  <img src={teacherIcon} alt="" className="teacher-img" />
                </div>
                <p className="txt">Generating answer...</p>
              </div>
            )}
            <div ref={messageEnd} />
          </div>
          <div className="chat-bottom">
            <div className="chat-input">
              <input
                type="text"
                name=""
                id=""
                placeholder="Hey, send message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleEnter}
              />
              <button className="chat-input-submit">
                <FontAwesomeIcon icon="fa-solid fa-arrow-up" />
              </button>
            </div>
            <p className="danger-txt">
              Tüs in AI can make mistakes, please check important information.{" "}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;
library.add(fab, fas, far);
