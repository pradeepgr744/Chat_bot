import React, { useEffect, useState } from "react";
import "./index.css";
import { GoogleGenerativeAI } from "@google/generative-ai";


const Chatbot = () => {

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [bgcolor, setbgcolor] = useState(false)
  const genAI = new GoogleGenerativeAI("AIzaSyCbJMRHMz51kIVFmDe7-zkAsWqM7AmIBDA");


  const sendMessage = async (e) => {
    e.preventDefault();
    if (inputText?.trim() === "clear" || "Clear" || "clr") {
      setMessages([]);
      setInputText("");
    }
    else if (inputText) {
      const newMessage = {
        role: "user",
        parts: inputText,
      };
      setMessages(prevArr => [...prevArr, newMessage]);
      setInputText("");
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
        const msg = inputText;
        const result = await model.generateContent(msg);
        const response = result.response;
        const text = response.text();
        const newMessage = {
          role: "model",
          parts: text,
        };
        setMessages(prevArr => [...prevArr, newMessage]);
      } catch {
        console.log("error")
      }
    }
  };

  return (
    <div className={`chatbot p-4 rounded-lg shadow-md h-screen flex flex-col sm-[100%],text-xs  md:w-[100%],text-md xl:w-[80%] text-xl m-auto ${bgcolor ? "transition ease-in-out duration-300 bg-gray-800 " : "transition ease-in-out duration-300 bg-gray-200"}`}>
      <header className={`flex items-center justify-between border-b pb-4 ${bgcolor ? "text-white border-white" : "text-black border-black"}`}>
        <h1 className="text-xl font-bold">Chatbot</h1>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" value="" className="sr-only peer" onClick={() => setbgcolor(!bgcolor)} />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none  rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-black"></div>
        </label>
      </header>

      <div className="conversation-area overflow-y-auto h-[300px] flex-grow ">
        {messages.map((message, index) => (
          <div
            className={`message ${message.role === "user" ? "bg-blue-100" : "bg-gray-100"
              }  p-4 rounded-lg my-2`}
            key={index}
          >
            <pre>{message.parts}</pre>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="flex static bottom-0 border-gray-400 border-2 bg-gray-300 rounded-xl">
        <textarea
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full p-2 bg-gray-300 border-none outline-none rounded-xl"
          required
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded-full w-[80px] m-2">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbot;