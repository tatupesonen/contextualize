export type MessageTypes = "GET_DOM_CONTENT"

type Message = {
  type: MessageTypes
}

// Ei välitetä senderistä, joten _
chrome.runtime.onMessage.addListener((message: Message, _, sendResponse) => {
  if (message.type === "GET_DOM_CONTENT") {
    const pageContent = document.documentElement.innerHTML;
    console.log("Sending page content to main process")
    sendResponse({ content: pageContent }); 
  }
  return true;
});