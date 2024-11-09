const inputMessage = document.querySelector("#input-message");
const chatBody = document.querySelector(".chat-body");
const sendButton = document.querySelector("#sendButton");
const fileInput = document.querySelector("#file-input");

const userData = {
    message: null,
}

// Api setup
const API_KEY = "AIzaSyBdIb3MFt7WhbwPCn1cghbLtgzUb9Ut6Sc";
const ApiURl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// Create message element with dynamic classes and return it
const createMessageElement = (content, classes) => {
    const div = document.createElement("div");
    div.classList.add("user-message", classes);
    div.innerHTML = content;
    return div;

}


// generate bot response using api
const generateBotResponse = async (incomingMessageDiv) => {

    const messageElement = incomingMessageDiv.querySelector(".chatbot-message");

    // Api request options
  const requestOption = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: userData.message }]
        }],
    }),
  };

  try {
    const response = await fetch(ApiURl, requestOption);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message); // typo corrected here

    const apiResponseTest = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
    messageElement.innerHTML = apiResponseTest;
  } catch (err) {
    console.log(err);
  } finally {
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
  }
};

// Handle outgoing user messages
const handleOutgoingMessage = (e) => {
    e.preventDefault();

    userData.message = inputMessage.value.trim();

    inputMessage.value = "";
    // Creaate and displsy user message
    const messageContent = `<div class="user-meg w-auto bg-blue-500 p-2 font-medium text-xs text-white"></div>`;

    const outgoingMessagediv = createMessageElement(messageContent, "user-message");
    outgoingMessagediv.querySelector(".user-meg").textContent = userData.message;
    chatBody.appendChild(outgoingMessagediv);
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth"});

    // simulate bot reponse with 
    setTimeout(() => {
        const messageContent = `<img src="charbot.png" class="w-[40px] py-1 bg-white rounded-[50%]" alt="">
                                <div class="chatbot-message bg-blue-100 p-2 font-medium text-sm"></div>`;
        const incomingMessageDiv = createMessageElement(
          messageContent,
          "bot-message"
        );
          chatBody.appendChild(incomingMessageDiv);
          chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
          generateBotResponse(incomingMessageDiv);
    }, 600);
}


// Handle Enet key press for sending messages
inputMessage.addEventListener("keydown", (e)=> {
    
   const userMessage = e.target.value.trim();

  if (e.key === "Enter" && userMessage) {
    e.preventDefault();
    handleOutgoingMessage(e);
  } 
})


// Send message button click event

sendButton.addEventListener("click", (e) => handleOutgoingMessage(e))

