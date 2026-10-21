import { useState, useRef, useEffect } from "react";
import { FaSmile, FaPaperclip, FaMicrophone } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { BsCheck2All } from "react-icons/bs";
import img from "../src/assets/download.jpeg";
import Footer from "./Footer";

const sendSound = new Audio("/send.m4a");
const receiveSound = new Audio("/receive.m4a");

const App = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chat, typing]);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString([], {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const sendMessage = async () => {
    if (message.trim() === "") return;

    const currentMessage = message;

    const userMsg = {
      text: currentMessage,
      sender: "user",
      seen: false,
      time: getCurrentTime(),
    };

    setChat((prev) => [...prev, userMsg]);

    // SEND SOUND
    sendSound.currentTime = 0;
    sendSound.play();

    setMessage("");
    setTyping(true);

    setTimeout(() => {
      setChat((prev) =>
        prev.map((msg, index) =>
          index === prev.length - 1 ? { ...msg, seen: true } : msg,
        ),
      );
    }, 1000);

    try {
      const response = await fetch(
        "https://chat-with-her.onrender.com/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: currentMessage,
          }),
        },
      );

      const data = await response.json();

      const aiMsg = {
        text: data.reply,
        sender: "ai",
        time: getCurrentTime(),
      };

      // RECEIVE SOUND
      receiveSound.currentTime = 0;
      receiveSound.play();

      setChat((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.log(error);
    } finally {
      setTyping(false);
    }
  };

  return (
    <>
      <div className="h-screen bg-[#111b21] flex items-center justify-center p-3">
        <div className="w-90 h-180 bg-[#0b141a] rounded-[40px] overflow-hidden border-8 border-black shadow-2xl flex flex-col">
          <div className="bg-black text-white text-xs px-5 py-2 flex justify-between items-center">
            <span>{getCurrentTime()}</span>

            <div className="flex gap-1">
              <span>📶</span>
              <span>📡</span>
              <span>🔋</span>
            </div>
          </div>

          <div className="h-16 bg-[#202c33] flex items-center justify-between px-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <img
                src={img}
                alt="profile"
                className="w-11 h-11 rounded-full object-cover"
              />

              <div>
                <h1 className="text-white font-medium text-lg">
                  She❤️❤️
                </h1>

                {!typing ? (
                  <p className="text-xs text-green-400">
                    online
                  </p>
                ) : (
                  <p className="text-xs text-green-400">
                    typing...
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-3">
            <div className="flex justify-center mb-4">
              <div className="bg-[#182229] text-gray-300 text-xs px-4 py-1 rounded-lg shadow">
                {getCurrentDate()}
              </div>
            </div>

            {chat.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[75%] text-white shadow wrap-break-words ${
                    msg.sender === "user"
                      ? "bg-[#005c4b]"
                      : "bg-[#202c33]"
                  }`}
                >
                  <p>{msg.text}</p>

                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-[11px] text-gray-300">
                      {msg.time}
                    </span>

                    {msg.sender === "user" && (
                      <BsCheck2All
                        className={`text-sm ${
                          msg.seen
                            ? "text-blue-400"
                            : "text-gray-300"
                        }`}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="bg-[#202c33] px-4 py-3 rounded-2xl">
                  typing...
                </div>
              </div>
            )}

            <div ref={chatEndRef}></div>
          </div>

          <div className="bg-[#202c33] px-3 py-2 flex items-center gap-3">
            <button className="text-gray-400 text-2xl">
              <FaSmile />
            </button>

            <button className="text-gray-400 text-xl rotate-45">
              <FaPaperclip />
            </button>

            <div className="flex-1">
              <input
                type="text"
                placeholder="Type a message"
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
                className="w-full bg-[#2a3942] text-white px-5 py-3 rounded-full outline-none"
              />
            </div>

            {message ? (
              <button
                onClick={sendMessage}
                className="text-[#00a884] text-2xl"
              >
                <IoSend />
              </button>
            ) : (
              <button className="text-gray-300 text-2xl">
                <FaMicrophone />
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default App;