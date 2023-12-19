import React, { useEffect, useRef, useState } from "react";
import "./index.css";
import { GoogleGenerativeAI } from "@google/generative-ai";


const Chatbot = () => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [bgcolor, setbgcolor] = useState(false)
  const genAI = new GoogleGenerativeAI("AIzaSyCbJMRHMz51kIVFmDe7-zkAsWqM7AmIBDA");
  const ref = useRef();

  const sendMessage = async (e) => {
    e.preventDefault();
    if (inputText?.trim().toLowerCase() === "clear") {
      setMessages([]);
      setInputText("");
    }
    else if (inputText) {
      setLoading(true);
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
        setLoading(false);
      } catch {
        console.log("error")
      }
    }
  };

  const copy = () => {
    const text = ref.current.textContent;
    navigator.clipboard.writeText(text);
  };

 

  return (
    <div className={`chatbot p-4 rounded-lg shadow-md h-[100dvh] flex flex-col text-lg sm-[100%]  md:w-[100%] xl:w-[80%] m-auto ${bgcolor ? "transition ease-in-out duration-300 bg-gray-800 " : "transition ease-in-out duration-300 bg-gray-200"}`}>
      <header className={`flex items-center justify-between border-b pb-4 ${bgcolor ? "text-white border-white" : "text-black border-black"}`}>
        <h1 className="text-xl font-bold">Chatbot</h1>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" value="" className="sr-only peer" onClick={() => setbgcolor(!bgcolor)} />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none  rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-black"></div>
        </label>
      </header>


      <div className="conversation-area overflow-y-auto h-[300px] w-[100%] flex-grow ">
        {messages.map((message, index) => (
          <div
            className={`message ${message.role === "user" ? "bg-blue-100" : "bg-gray-100"
              }  p-4 rounded-lg my-2`}
            key={index}
          >
            <button onClick={copy}
              className="flex justify-end w-[100%]"
            ><img src="src/assets/copy_icon.svg" alt="" /></button>
            <pre ref={ref} className="whitespace-pre-line">{message.parts}</pre>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="flex static bottom-0 border-gray-400 border-2 bg-gray-300 rounded-xl w-[100%]">

        <textarea
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-[88%] p-2 bg-gray-300 border-none outline-none rounded-xl"
          required
        />

          {loading ?
            <div role="status" className=" bg-blue-500 text-white w-[12%] flex justify-center h-auto items-center rounded-lg">
              <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
              <span class="sr-only">Loading...</span>
            </div>:
          <button type="submit" className=" bg-blue-500 text-white w-[12%] flex justify-center h-auto items-center rounded-lg">
          <img src="src/assets/send.svg" alt="" />
        </button>  
        
        
          }
      </form>
    </div>
  );
};

export default Chatbot;