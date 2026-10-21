import { useState, useRef, useEffect } from "react";
import { FaSmile, FaPaperclip, FaMicrophone, FaLock } from "react-icons/fa";
import { IoSend, IoVideocam, IoCall, IoArrowBack } from "react-icons/io5";
import { BsCheck2All, BsThreeDotsVertical } from "react-icons/bs";
import img from "../src/assets/download.jpeg";
import Footer from "./Footer";

const sendSound = new Audio("/send.m4a");
const receiveSound = new Audio("/receive.m4a");
sendSound.preload = "auto";
receiveSound.preload = "auto";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [typing, setTyping] = useState(false);
  const [currentTimeDisplay, setCurrentTimeDisplay] = useState("");
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Keep phone status-bar clock synchronized
  useEffect(() => {
    const updateTime = () => {
      setCurrentTimeDisplay(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Smooth scroll to bottom on message or typing change
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
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      text: currentMessage,
      sender: "user",
      seen: false,
      time: getCurrentTime(),
    };

    setChat((prev) => [...prev, userMsg]);

    // SEND SOUND
    try {
      sendSound.currentTime = 0;
      sendSound.play().catch(() => {});
    } catch {
      // Audio playback failsafe for autoplay policies
    }

    setMessage("");
    setTyping(true);

    // Keep input focused for seamless typing experience
    inputRef.current?.focus();

    setTimeout(() => {
      setChat((prev) =>
        prev.map((msg) =>
          msg.id === userMsg.id ? { ...msg, seen: true } : msg
        )
      );
    }, 1000);

    try {
      const response = await fetch(`${backendUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentMessage,
        }),
      });

      const data = await response.json();

      const aiMsg = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        text: data.reply,
        sender: "ai",
        time: getCurrentTime(),
      };

      // RECEIVE SOUND
      try {
        receiveSound.currentTime = 0;
        receiveSound.play().catch(() => {});
      } catch {
        // Audio playback failsafe for autoplay policies
      }

      setChat((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.log(error);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1418] flex flex-col items-center justify-between p-2 sm:p-4 select-none">
      {/* Smartphone Chassis Mockup */}
      <div className="w-full max-w-[420px] h-[92vh] max-h-[820px] min-h-[580px] bg-[#0b141a] rounded-[36px] sm:rounded-[42px] overflow-hidden border-[6px] sm:border-[8px] border-[#222d34] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.85),0_0_35px_rgba(37,211,102,0.06)] flex flex-col relative transition-all">
        
        {/* Phone Top Status Bar & Dynamic Island */}
        <div className="bg-[#1f2c34] text-gray-300 text-[11px] px-6 pt-2 pb-1.5 flex justify-between items-center select-none z-20">
          <span className="font-semibold text-xs tracking-tight">
            {currentTimeDisplay || getCurrentTime()}
          </span>

          {/* Dynamic Island / Notch */}
          <div className="h-4 w-24 bg-black rounded-full flex items-center justify-end px-2 gap-1.5 shadow-inner">
            <div className="w-2 h-2 rounded-full bg-[#111b21] border border-gray-800"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#005c4b]/60"></div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-300">
            <span className="text-[10px]">5G</span>
            <span>📶</span>
            <span className="text-[10px]">🔋</span>
          </div>
        </div>

        {/* WhatsApp App Header */}
        <div className="h-16 bg-[#202c33] flex items-center justify-between px-3.5 border-b border-[#2a3942]/60 shadow-md z-10">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              className="text-gray-300 hover:text-white p-1 rounded-full transition-colors active:scale-95"
              aria-label="Back"
            >
              <IoArrowBack className="text-xl" />
            </button>

            <div className="relative cursor-pointer">
              <img
                src={img}
                alt="profile"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#202c33] rounded-full"></span>
            </div>

            <div className="cursor-pointer">
              <h1 className="text-white font-medium text-base tracking-tight leading-snug flex items-center gap-1">
                <span>She</span>
                <span className="text-rose-500">❤️❤️</span>
              </h1>

              {!typing ? (
                <p className="text-[11px] text-[#25d366] font-medium leading-none flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25d366] inline-block animate-pulse"></span>
                  online
                </p>
              ) : (
                <p className="text-[11px] text-[#25d366] font-medium leading-none flex items-center gap-1">
                  typing...
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 text-gray-300 text-lg">
            <button
              type="button"
              className="hover:text-white transition-colors p-1 active:scale-90"
              aria-label="Video Call"
              title="Video Call"
            >
              <IoVideocam />
            </button>
            <button
              type="button"
              className="hover:text-white transition-colors p-1 active:scale-90"
              aria-label="Voice Call"
              title="Voice Call"
            >
              <IoCall className="text-[17px]" />
            </button>
            <button
              type="button"
              className="hover:text-white transition-colors p-1 active:scale-90"
              aria-label="Menu"
              title="More Options"
            >
              <BsThreeDotsVertical className="text-base" />
            </button>
          </div>
        </div>

        {/* Chat Message Scrollable Container with WhatsApp Wallpaper */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-3.5 space-y-2.5 whatsapp-bg relative">
          {/* Date Separator Pill */}
          <div className="flex justify-center mb-3 sticky top-1 z-10">
            <div className="bg-[#182229]/90 backdrop-blur-xs text-gray-400 text-[11px] font-medium px-3.5 py-1 rounded-lg shadow-sm border border-gray-800/40">
              {getCurrentDate()}
            </div>
          </div>

          {/* End-to-end Encryption Banner */}
          {chat.length === 0 && (
            <div className="flex justify-center px-4 my-4 animate-message-pop">
              <div className="bg-[#182229]/80 border border-amber-500/20 text-[#ffeecd] text-[11px] text-center px-4 py-2 rounded-xl shadow max-w-[90%] flex items-center gap-2">
                <FaLock className="text-amber-400 shrink-0 text-xs" />
                <span>
                  Messages are end-to-end encrypted. No one outside of this chat can read them.
                </span>
              </div>
            </div>
          )}

          {/* Messages */}
          {chat.map((msg, index) => (
            <div
              key={msg.id || index}
              className={`flex animate-message-pop ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`relative px-3.5 py-2 max-w-[82%] text-white shadow-md text-sm leading-relaxed break-words select-text ${
                  msg.sender === "user"
                    ? "bg-[#005c4b] rounded-2xl rounded-tr-xs"
                    : "bg-[#202c33] rounded-2xl rounded-tl-xs"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>

                <div className="flex items-center justify-end gap-1 mt-1 -mb-0.5 select-none">
                  <span className="text-[10px] text-gray-300/80 font-normal">
                    {msg.time}
                  </span>

                  {msg.sender === "user" && (
                    <BsCheck2All
                      className={`text-sm ${
                        msg.seen ? "text-[#53bdeb]" : "text-[#8696a0]"
                      }`}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator Bubble */}
          {typing && (
            <div className="flex justify-start animate-message-pop">
              <div className="bg-[#202c33] px-4 py-2.5 rounded-2xl rounded-tl-xs shadow-md flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></span>
                <span className="text-[11px] text-gray-300 ml-1 font-medium">typing...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        {/* WhatsApp Chat Input Dock */}
        <div className="bg-[#202c33] px-2.5 py-2 flex items-center gap-2 border-t border-[#2a3942]/40 z-10">
          <button
            type="button"
            className="text-gray-400 hover:text-gray-200 text-xl p-1.5 rounded-full transition-colors active:scale-90"
            aria-label="Emoji Picker"
          >
            <FaSmile />
          </button>

          <button
            type="button"
            className="text-gray-400 hover:text-gray-200 text-lg rotate-45 p-1.5 rounded-full transition-colors active:scale-90"
            aria-label="Attach File"
          >
            <FaPaperclip />
          </button>

          <div className="flex-1">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              className="w-full bg-[#2a3942] text-white placeholder-gray-400 text-sm px-4 py-2.5 rounded-full outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
            />
          </div>

          {message.trim() ? (
            <button
              onClick={sendMessage}
              className="w-10 h-10 bg-[#00a884] hover:bg-[#008f6f] text-white rounded-full flex items-center justify-center text-lg shadow-md transition-transform active:scale-95"
              aria-label="Send Message"
            >
              <IoSend className="ml-0.5" />
            </button>
          ) : (
            <button
              type="button"
              className="w-10 h-10 bg-[#2a3942] hover:bg-[#32444f] text-gray-300 rounded-full flex items-center justify-center text-base shadow-sm transition-transform active:scale-95"
              aria-label="Voice Message"
            >
              <FaMicrophone />
            </button>
          )}
        </div>
      </div>

      {/* Modernized Footer */}
      <Footer />
    </div>
  );
};

export default App;
