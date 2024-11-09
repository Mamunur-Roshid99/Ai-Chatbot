// ----------------------------------HTMl Elements connected --------------------------------
const inputMessage = document.querySelector("#input-message");
const chatBody = document.querySelector(".chat-body");
const sendButton = document.querySelector("#sendButton");

// Api setup
API_KEY = "AIzaSyBdIb3MFt7WhbwPCn1cghbLtgzUb9Ut6Sc";
API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;


const userData = {
  message: null
}

// --------------------------------------create message element----------------------------------------
const createMessageElement = (content, classes) => {
  const div = document.createElement("div");
  div.classList.add("user-message", classes);
  div.innerHTML = content;
  return div;
}


// ----------------------------------Handle out going message function----------------------------------------
const handleOutgoingMessage = (e) => {
  e.preventDefault();

  userData.message = inputMessage.value.trim();

  inputMessage.value = "";

  // ----------------------------------Creaate and displsy user message-----------------------------------------
  const messageContent = `<div class="user-meg w-auto bg-blue-500 p-2 font-medium text-xs text-white"></div>`;
  const outgoingMessageDiv = createMessageElement(messageContent, "user-message");
  outgoingMessageDiv.querySelector(".user-meg").textContent = userData.message;
  chatBody.appendChild(outgoingMessageDiv);
  chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

  // ------AI bot message output---------
  setTimeout(() => {
    const messageContent = `<img src="charbot.png" class="w-[40px] py-1 bg-white rounded-[50%]" alt="">
                            <div class="chatbot-message bg-blue-100 p-2 font-medium text-sm"></div>`;
    const ingoingMessageDiv = createMessageElement(messageContent,"bot-message"); 
    chatBody.appendChild(ingoingMessageDiv); 
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });  
    generateBotResponse(ingoingMessageDiv);                
  }, 500);
}

// ------------------------------------------generate bot response-----------------------------------------
const generateBotResponse = async (incomingMessageDiv) => {
  const messageElement = incomingMessageDiv.querySelector(".chatbot-message");

  const requestOption = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: userData.message }],
        },
      ],
    }),
  }

// display bot response 
  try {
    const response = await fetch(API_URL, requestOption);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message); // typo corrected here

    const apiResponseTest = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
    messageElement.innerHTML = apiResponseTest;
  } catch(err) {
    console.log(err);
  } finally {
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
  }
}


// ------------------------------------------add EventListener----------------------------------

// input event listener
inputMessage.addEventListener("keydown", (e) => {
  const userMessage = e.target.value.trim();
  
  if (e.key === "Enter" && userMessage) {
    e.preventDefault();
    handleOutgoingMessage(e);
  }
})

// send button event listener
sendButton.addEventListener("click", (e) => handleOutgoingMessage(e))