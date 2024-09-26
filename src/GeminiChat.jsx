import React, { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactQuill from "react-quill"; // Import React Quill
import "react-quill/dist/quill.snow.css"; // Import the CSS for Quill

const GeminiChat = () => {
  const [story, setStory] = useState(""); // Holds the AI-generated response
  const [loading, setLoading] = useState(false); // Loading state for fetching the AI response
  const [userInput, setUserInput] = useState(""); // Holds the user's input
  const [chatHistory, setChatHistory] = useState([]); // Holds the entire conversation
  const customPrompt =
    "Provide empathetic advice and use emojis to show encouragement.";
  // Handle user submitting a message
  const handleSendMessage = async () => {
    if (!userInput.trim()) return; // Don't send empty messages

    // Add user's message to chat history
    setChatHistory((prevChat) => [
      ...prevChat,
      { sender: "user", text: userInput },
    ]);

    setLoading(true); // Show loading indicator for the AI response

    try {
      const genAI = new GoogleGenerativeAI(
        "AIzaSyBhz3UhAXZreOyUxnEJ611tE4rmAdZwzIM"
      );
      const model = genAI.getGenerativeModel(
        { model: "tunedModels/mental-health-model-2-6yzdk8id9dd2" },
        {
          temperature: 0.5,
          maxTokens: 100,
          responseLength: 1000,
        }
      );
      const combinedPrompt = `${userInput}. ${customPrompt}`;

      const result = await model.generateContent(combinedPrompt);
      const responseText = await result.response.text();

      // Add the AI's response to chat history
      setChatHistory((prevChat) => [
        ...prevChat,
        { sender: "bot", text: responseText },
      ]);
      setStory(responseText); // Set response as the story
    } catch (error) {
      console.error("Error fetching story:", error);
      setChatHistory((prevChat) => [
        ...prevChat,
        {
          sender: "bot",
          text: "Sorry, I encountered an issue. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
      setUserInput(""); // Clear user input after sending the message
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold text-center mb-4 text-gray-800">
        Gemini AI Chat
      </h1>

      <div className="chat-window h-96 overflow-y-auto p-4 bg-gray-100 rounded-md border border-gray-300 mb-4">
        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={`mb-3 p-3 ${
              message.sender === "user"
                ? "bg-blue-500 text-white text-right rounded-tl-xl rounded-br-xl"
                : "bg-gray-300 text-gray-800 text-left rounded-tr-xl rounded-bl-xl"
            }`}
          >
            <ReactQuill value={message.text} readOnly={true} theme="bubble" />
          </div>
        ))}
        {loading && (
          <div className="text-center text-gray-600">Gemini is typing...</div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <input
          type="text"
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default GeminiChat;
