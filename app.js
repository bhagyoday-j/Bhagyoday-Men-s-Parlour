const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const chatWindow = document.getElementById("chat-window");

const API_KEY = "AIzaSyCqM_JD2yhIwDKk8bfY341IbRkQZ9qgDV0";

const systemInstructionText = `Language: Marathi
Tone: Friendly, Informal, and Humorous
Business Type: Men’s Parlour
Shop Name: Bhagyoday Men’s Parlour
Owner Name: Mahesh Jadhav
Response Style: Like a talkative, fun-loving, witty Marathi bhai.
`;

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  addMessageToUI(userMessage, "user");
  userInput.value = "";
  showTypingIndicator();

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userMessage }] }],
          systemInstruction: { parts: [{ text: systemInstructionText }] },
        }),
      }
    );

    const data = await response.json();
    const aiMessage = data.candidates[0].content.parts[0].text;
    removeTypingIndicator();
    addMessageToUI(aiMessage, "ai");
  } catch (err) {
    removeTypingIndicator();
    addMessageToUI("माफ करा भाऊ, काहीतरी गडबड झाली आहे! 😓", "ai");
    console.error(err);
  }
});

function addMessageToUI(text, sender) {
  const msg = document.createElement("div");
  msg.className = sender === "user" ? "user-message" : "ai-message";
  const avatar =
    sender === "ai" ? `<img src="aiBhau.jpg" class="avatar"/>` : "";
  msg.innerHTML = `${avatar}<div class="message-content"><p>${text}</p></div>`;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function showTypingIndicator() {
  const indicator = document.createElement("div");
  indicator.className = "ai-message typing-indicator";
  indicator.innerHTML = `
        <img src="aiBhau.jpg" class="avatar"/>
        <div class="message-content"><p><span></span><span></span><span></span></p></div>`;
  chatWindow.appendChild(indicator);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function removeTypingIndicator() {
  const indicator = chatWindow.querySelector(".typing-indicator");
  if (indicator) indicator.remove();
}
