import React, { useContext, useEffect, useRef, useState } from "react";
import { userDataContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import aiImg from "../assets/ai.gif";
import userImg from "../assets/user.gif";

function Home() {
  const { userData, setUserData, getGeminiResponse } = useContext(userDataContext);
  const navigate = useNavigate();

  const [listening, setListening] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");

  const recognitionRef = useRef(null);
  const synth = window.speechSynthesis;
  const [voices, setVoices] = useState([]);
  const greetedRef = useRef(false);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      if (availableVoices.length) setVoices(availableVoices);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Text-to-Speech
  const speak = (text = "", lang = "en-IN") => {
    if (!text.trim() || !voices.length) return;
    if (synth.speaking) synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    const selectedVoice =
      voices.find(v => v.lang === lang && v.name.toLowerCase().includes("female")) ||
      voices.find(v => v.lang === lang) ||
      voices[0];
    utterance.voice = selectedVoice;

    setAiSpeaking(true);
    utterance.onend = () => setAiSpeaking(false);
    synth.speak(utterance);
  };

  // Greet user on first load
  useEffect(() => {
    if (!greetedRef.current && userData?.assistantName && voices.length) {
      const greeting = `Hello! I am ${userData.assistantName}. How can I help you today?`;
      setAiText(greeting);
      speak(greeting);
      greetedRef.current = true;
    }
  }, [userData, voices]);

  const handleLogout = () => {
    setUserData(null);
    navigate("/signin");
  };

  // Open site helper
  const openSite = (url, name) => {
    window.open(url, "_blank");
    speak(`${name} is opening`);
  };

  // Command handler
  const handleCommand = (data) => {
    const { type = "general", userInput = "", response = "" } = data;

    const siteCommands = [
      "google_search","youtube_search","youtube_play","maps_open",
      "weather_show","calculator_open","instagram_open","calendar_event","facebook_open",
      "twitter_open","whatsapp_open","spotify_open","gmail_open","song_play","calender_open", // Added calender_open
      "news_show", // Added news_show
    ];

    // The backend functions (get_date, get_time, etc.) are NOT site commands, 
    // so they will fall through to the default logic below, which is correct
    // because the backend provides the complete response text.

    if (!siteCommands.includes(type) && userInput) setUserText(userInput);
    if (response) setAiText(response);

    // Handle actionable commands
    switch(type){
      case "google_search":
        if(userInput) openSite(`https://www.google.com/search?q=${encodeURIComponent(userInput)}`, "Google");
        break;
      case "youtube_search":
      case "youtube_play":
      case "song_play":
        if(userInput) openSite(`https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`, "YouTube");
        break;
      case "weather_show":
        openSite("https://www.google.com/search?q=weather","Weather Info");
        break;
      case "calculator_open":
        openSite("https://www.google.com/search?q=online+calculator", "Calculator");
        break;
      case "calender_open": // Corrected spelling for consistency
      case "calendar_event":
        openSite("https://www.google.com/search?q=online+calendar", "Calendar");
        break;
      case "instagram_open":
        openSite("https://www.instagram.com","Instagram");
        break;
      case "facebook_open":
        openSite("https://www.facebook.com","Facebook");
        break;
      case "twitter_open":
        openSite("https://twitter.com","Twitter");
        break;
      case "whatsapp_open":
        openSite("https://web.whatsapp.com","WhatsApp");
        break;
      case "spotify_open":
        openSite("https://open.spotify.com","Spotify");
        break;
      case "gmail_open":
        openSite("https://mail.google.com","Gmail");
        break;
      case "maps_open":
        openSite("https://maps.google.com","Google Maps");
        break;
      case "news_show":
        openSite("https://news.google.com","Latest News");
        break;
      default:
        // This default handles 'get_date', 'get_time', etc. 
        // as well as 'general' responses, since the full text is in 'response'.
        break;
    }

    if(userInput && response) setHistory(prev => [{ user: userInput, ai: response }, ...prev]);
    if(response) speak(response);
  };

  // Speech recognition setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.interimResults = false;
    recognition.lang = "en-IN";
    recognitionRef.current = recognition;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognition.onresult = async (event) => {
      const lastResult = event.results[event.results.length - 1];
      if (!lastResult.isFinal) return;

      const transcript = lastResult[0].transcript.trim();
      if (!transcript) return;

      setUserText(transcript);
      setAiText("Thinking...");

      try {
        let data = await getGeminiResponse(transcript);
        if (typeof data === "string") {
          try { data = JSON.parse(data); } 
          catch { data = { type: "general", userInput: transcript, response: data }; }
        }
        handleCommand(data);
      } catch (err) {
        console.error(err);
        setAiText("Something went wrong");
        speak("Something went wrong");
      }
    };

    return () => recognition.stop();
  }, [voices, getGeminiResponse]);

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    listening ? recognition.stop() : recognition.start();
  };

  const deleteHistoryItem = (index) => setHistory(prev => prev.filter((_, i) => i !== index));

 return (
  <div className="w-full h-screen bg-gradient-to-br from-[#05051e] via-[#0b0b3f] to-black flex flex-col justify-center items-center relative px-4 overflow-auto text-white font-sans">

    {/* === Top Navigation Buttons === */}
    <div className="absolute top-6 right-6 flex gap-4 z-50">
      <button
        onClick={() => navigate("/customize")}
        className="px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:shadow-blue-500/40 transition-transform transform hover:scale-105 duration-300"
      >
        ← Customize
      </button>

      <button
        onClick={handleLogout}
        className="px-6 py-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 hover:shadow-red-500/40 transition-transform transform hover:scale-105 duration-300"
      >
        Logout
      </button>
    </div>

    {/* === History Toggle === */}
    <button
      onClick={() => setShowHistory((prev) => !prev)}
      className="absolute top-32 right-6 px-5 py-2 border border-yellow-400 text-yellow-400 font-semibold rounded-full shadow-lg hover:bg-yellow-400 hover:text-black transition-all transform hover:scale-110 animate-bounce z-50"
    >
      {showHistory ? "Hide History" : "Show History"}
    </button>

    {/* === Chat History Panel === */}
    {showHistory && (
      <div className="absolute top-44 right-6 max-h-80 w-80 bg-gradient-to-tr from-gray-900 via-gray-950 to-black p-4 rounded-2xl shadow-2xl border border-gray-700 overflow-y-auto animate-slide-left z-40 backdrop-blur-sm">
        <h3 className="text-yellow-400 font-bold text-lg mb-3 text-center animate-pulse tracking-wide">
          🕒 Conversation History
        </h3>
        {history.length === 0 ? (
          <p className="text-gray-400 text-center italic">No history yet</p>
        ) : (
          history.map((item, index) => (
            <div
              key={index}
              className="mb-3 border border-gray-700 bg-gray-800/60 p-3 rounded-xl hover:bg-gray-700 transition-colors shadow-md"
            >
              <p className="text-blue-400 font-semibold">
                👤 You: <span className="text-gray-200">{item.user}</span>
              </p>
              <p className="text-green-400 font-semibold mt-1">
                🤖 AI: <span className="text-gray-200">{item.ai}</span>
              </p>
              <button
                onClick={() => deleteHistoryItem(index)}
                className="mt-2 px-3 py-1 text-xs bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    )}

    {/* === Page Heading === */}
    <h1 className="text-white text-[36px] md:text-[44px] font-extrabold text-center leading-snug mt-24 mb-10 tracking-wide drop-shadow-[0_0_10px_rgba(59,130,246,0.6)] animate-fade-in">
      Your Personal <span className="text-blue-400">AI Assistant</span>
    </h1>
    <p className="text-gray-400 text-center max-w-xl mb-10 text-lg animate-fade-in">
      Experience your own intelligent companion – always ready to listen, assist, and respond instantly.
    </p>

    {/* === Main Assistant Section === */}
    <div className="flex flex-col lg:flex-row justify-center items-center gap-12 mt-6 flex-wrap animate-fade-in">

      {/* === Assistant Display Card === */}
      <div className="w-[320px] h-[420px] flex justify-center items-center overflow-hidden rounded-3xl shadow-2xl border border-blue-500/70 p-2 animate-float bg-gradient-to-b from-gray-800/50 to-gray-900/70 backdrop-blur-md">
        {userData?.assistantImage ? (
          <img
            src={userData.assistantImage}
            alt="Assistant"
            className="h-full w-full object-cover rounded-2xl shadow-lg"
          />
        ) : (
          <div className="flex justify-center items-center w-full h-full bg-gray-800 rounded-2xl shadow-lg">
            <h1 className="text-white text-2xl font-bold text-center animate-pulse">
              {userData?.assistantName || "Your Assistant"}
            </h1>
          </div>
        )}
      </div>

      {/* === Assistant Identity Section === */}
      {userData?.assistantName && (
        <div className="flex flex-col justify-center items-center gap-6 animate-fade-in">
          <h2 className="text-white text-4xl font-extrabold drop-shadow-lg animate-bounce tracking-wide">
            👋 I’m {userData.assistantName}
          </h2>
          <img
            src={aiSpeaking ? aiImg : userImg}
            className="w-[220px] animate-slide-up"
            alt="Assistant Animation"
          />
        </div>
      )}

      {/* === Voice Interaction Section === */}
      <div className="flex flex-col justify-center items-center gap-6 animate-fade-in">
        <button
          onClick={toggleListening}
          className={`px-10 py-4 rounded-full text-white font-bold shadow-xl transition-all transform duration-300 ${
            listening
              ? "bg-red-600 hover:bg-red-700 scale-110 shadow-red-500/40"
              : "bg-green-600 hover:bg-green-700 scale-105 shadow-green-500/40"
          }`}
        >
          {listening ? "🛑 Stop Listening" : "🎙 Start Listening"}
        </button>

        <p className="text-gray-400 mt-1 text-lg animate-pulse">
          {listening ? "🎤 Listening..." : "🛑 Not Listening"}
        </p>

        {/* === User and AI Text Display === */}
        <div className="mt-2 text-center max-w-xs space-y-2">
          {userText && (
            <p className="text-blue-400 text-lg md:text-xl font-semibold animate-slide-up bg-blue-500/10 rounded-lg p-2 border border-blue-500/20">
              🧑‍💻 {userText}
            </p>
          )}
          {aiText && (
            <p className="text-green-400 text-lg md:text-xl font-semibold animate-slide-up bg-green-500/10 rounded-lg p-2 border border-green-500/20">
              🤖 {aiText}
            </p>
          )}
        </div>
      </div>
    </div>

    {/* === Footer === */}
   <footer className="absolute bottom-4 text-gray-400 text-sm text-center w-full">
  © {new Date().getFullYear()} Designed & Developed by <span className="text-blue-400 font-semibold">Ayush</span>
</footer>
  </div>
);

}

export default Home;